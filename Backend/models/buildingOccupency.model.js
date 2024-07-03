const Building = require("../schema/building.schema");
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
