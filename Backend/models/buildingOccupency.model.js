const { default: mongoose } = require("mongoose");
const Building_Occupency_Logs = require("../schema/building_occupency_logs.schema");
const runPromise = require("../utils/promiseUtil");


function updateBuildingLogs(building_id, vehicleType, locked = 0, occupied = 0) {
    return new Promise(async (resolve, reject) => {
        const updatePaths = {
            [`spots_log.${vehicleType}.locked`]: locked,
            [`spots_log.${vehicleType}.occupied`]: occupied
        };

        const [updatedBuilding, err] = await runPromise(Building_Occupency_Logs.findOneAndUpdate(
            { building_id: building_id },
            { $inc: updatePaths },
            { new: true }
        ))

        if (err) {
            reject(err)
        }

        resolve(updatedBuilding)

    });
}

function getOccupantBuilding(infra_id, vehicle_type) {
    return new Promise((resolve, reject) => {
        const checkKey = `spots_log.${vehicle_type}`
        const totalKey = `$spots_log.${vehicle_type}.total`

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

module.exports = { getOccupantBuilding, updateBuildingLogs }
