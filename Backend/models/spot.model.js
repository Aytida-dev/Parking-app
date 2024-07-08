const { default: mongoose } = require("mongoose");
const { checkSpot, lockSpot, unlockSpot } = require("../cache/lock_unlock.cache")
const Building = require("../schema/building.schema");
const runPromise = require("../utils/promiseUtil");

async function findSpotBySpotIds(spot_ids) {
    if (!spot_ids || !Array.isArray(spot_ids) || !spot_ids.length) {
        throw new Error("Invalid spot ids");
    }

    spot_ids = spot_ids.map((spot_id) => {
        return new mongoose.Types.ObjectId(spot_id)
    })

    const pipeline = [
        { $unwind: "$floors" },
        { $unwind: "$floors.parking_spots" },
        { $match: { "floors.parking_spots.spot_id": { $in: spot_ids } } },

        {
            $project: {
                "building_id": "$_id",
                "building_name": "$name",
                "infra_id": "$parking_infra_id",
                "floor": "$floors.floor_number",
                "spot_id": "$floors.parking_spots.spot_id",
                "spot_name": "$floors.parking_spots.spot_name",
                "status": "$floors.parking_spots.status",
                "vehicle_number": "$floors.parking_spots.vehicle_number",
                "vehicle_type": "$floors.parking_spots.vehicle_type"
            }
        }
    ]

    try {
        const [result, err] = await runPromise(Building.aggregate(pipeline))
        if (err) {
            if (err.name === "CastError") {
                throw new Error("Invalid spot id")
            }

            throw new Error("Internal server error while fetching spots")
        }

        if (result.length !== spot_ids.length) {
            throw new Error("Invalid spot id")
        }

        return result
    }
    catch (error) {
        throw error;
    }
}








function findAndLockSpots(requirements, buildingOccupencyData) {
    return new Promise((resolve, reject) => {
        if (!requirements) {
            reject("Requirements object is required")
            return
        }

        if (!buildingOccupencyData || !buildingOccupencyData.length || !buildingOccupencyData[0].length) {
            reject("No building available for occupency")
            return
        }

        const result = []
        let totalRequiredOccupency = 0

        Object.keys(requirements).map((vehicle_type, i) => {
            const buildings = buildingOccupencyData[i]
            let required_occupency = requirements[vehicle_type]

            totalRequiredOccupency += required_occupency

            let flag = 0

            for (let j in buildings) {
                if (flag) break

                const building = buildings[j]
                let remaining_occupency = building.occupency
                const floors = building.building[0].floors

                for (let k in floors) {
                    if (flag) break

                    const spots = floors[k].parking_spots
                    for (let spot of spots) {

                        if (flag) break

                        if (spot.vehicle_type === vehicle_type && spot.status === "VACANT" && !checkSpot(spot.spot_id)) {
                            try {
                                lockSpot(spot.spot_id, building.building_id, vehicle_type)

                                result.push(spot.spot_id)

                                --remaining_occupency
                                --required_occupency
                            } catch (error) {
                                console.log(error);
                                continue
                            }
                        }

                        if (!remaining_occupency || !required_occupency) {
                            flag = 1
                        }
                    }
                }

            }
        })

        if (!result.length || result.length !== totalRequiredOccupency) {
            reject("All spots are already booked")

            result.map((spot_id) => {
                unlockSpot(spot_id)
            })
            return
        }

        resolve(result)



    })
}

async function changeSpotStatus(spot_id, status, vehicle_number = null) {
    if (!spot_id || !status) {
        throw new Error("Spot id and status are required");
    }

    if (status === "OCCUPIED" && !vehicle_number) {
        throw new Error("Vehicle number is required for status OCCUPIED");
    }

    try {
        const result = await Building.findOneAndUpdate(
            { "floors.parking_spots.spot_id": spot_id },
            {
                $set: {
                    "floors.$[].parking_spots.$[spot].status": status,
                    "floors.$[].parking_spots.$[spot].vehicle_number": vehicle_number
                }
            },
            {
                arrayFilters: [{ "spot.spot_id": spot_id }],
                new: true
            }
        );

        if (result) {
            return "Spot status changed";
        } else {
            throw new Error("Spot not found");
        }
    } catch (error) {
        throw error;
    }
}

module.exports = {
    findAndLockSpots, changeSpotStatus, findSpotBySpotIds
}