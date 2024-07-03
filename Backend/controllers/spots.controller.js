const { checkSpot, lockSpot } = require("../cache/lock_unlock.cache")
const { getOccupantBuilding } = require("../models/buildingOccupency.model")

exports.lockSpots = async (req, res) => {
    const egData = {
        infra_id: "668274c11070e6ac0d3cfe06",
        requirements: { BIKE: 3 }
    }

    try {
        const promiseArr = Object.keys(egData.requirements).map((car_type) => {
            return getOccupantBuilding(egData.infra_id, car_type)
        })

        const data = await Promise.all(promiseArr)

        const result = []

        Object.keys(egData.requirements).map((vehicle_type, i) => {
            const buildings = data[i]
            let required_occupency = egData.requirements[vehicle_type]

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
                            lockSpot(spot.spot_id)
                            result.push(spot.spot_id)
                            --remaining_occupency
                            --required_occupency
                        }

                        if (!remaining_occupency || !required_occupency) {
                            flag = 1
                        }
                    }
                }

            }
        })

        res.send({
            result, data
        })
    } catch (error) {
        console.log(error);
        res.send(error)
    }
}