const { default: mongoose } = require("mongoose");
const Building = require("../schema/building.schema");
const Building_Occupency_Logs = require("../schema/building_occupency_logs.schema");
const handleErr = require("../utils/errHandler");
const runPromise = require("../utils/promiseUtil");

const findVehicleTypeBySpotId = (floors, spotId) => {
    for (const floor of floors) {
        const spot = floor.parking_spots.find(spot => spot.spot_id.toString() === spotId);
        if (spot) {
            return spot.vehicle_type;
        }
    }
    return null;
};

function updateLogsBySpotId(spot_id) {
    return new Promise(async (resolve, reject) => {
        const [spot_data, err] = await runPromise(
            Building.findOne({
                "floors.parking_spots.spot_id": id,
            }).select(
                "_id floors.parking_spots.vehicle_type floors.parking_spots.spot_id"
            )
        );

        const vehicleType = findVehicleTypeBySpotId(spot_data.floors, spot_id)

        const updatePaths = {
            [`spots_log.${vehicleType}.total`]: 1,
            [`spots_log.${vehicleType}.locked`]: -1,
            [`spots_log.${vehicleType}.occupied`]: 0
        };

        const updatedBuilding = await Building_Occupency_Logs.findOneAndUpdate(
            { building_id: data._id },
            { $inc: updatePaths },
            { new: true }
        )

    });
}

function getOccupantBuilding(infra_id, vehicle_type) {
    return new Promise((resolve, reject) => {
        const checkKey = `spots_log.${vehicle_type}`
        const totalKey = `$spots_log.${vehicle_type}.locked`

        const pipeline = [
            {
                $match: {
                    infra_id: new mongoose.Types.ObjectId(infra_id),
                    [checkKey]: { $exists: true },
                    $expr: {
                        $gt: [
                            [totalKey],
                            { $add: [`$spots_log.${vehicle_type}.occupied`, `$spots_log.${vehicle_type}.locked`] }
                        ]
                    }
                }
            },
            {
                $lookup: {
                    from: 'buildings',
                    localField: 'building_id',
                    foreignField: '_id',
                    as: 'building'
                }
            },
            {
                $addFields: {
                    occupency: {
                        $subtract: [`$spots_log.${vehicle_type}.total`, { $add: [`$spots_log.${vehicle_type}.occupied`, `$spots_log.${vehicle_type}.locked`] }]
                    }
                }
            },
            {
                $sort: {
                    occupency: -1
                }
            }

        ]

        Building_Occupency_Logs.aggregate(pipeline).then((data) => {
            resolve(data)
        }).catch((err) => {
            reject(err)
        })
    })
}

module.exports = { getOccupantBuilding }
