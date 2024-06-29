const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const buildingSchema = new Schema({
    parking_infra: { type: Schema.Types.ObjectId, ref: 'Infrastructure' },
    name: { type: String, required: true },

    allowed_vehicles: {
        type: [String],
        enum: ["SUV", "SEDAN", "BUS", "TRUCK", "BIKE", "TRIKE", "CYCLE"],
        required: true
    },

    rates: {
        type: Map,
        of: {
            HOURLY: { type: Number, required: true },
            DAILY: { type: Number, required: true }
        }
    },

    floors: [
        {
            floor_number: { type: Number, required: true },
            parking_spots: [
                {
                    spot_id: { type: Schema.Types.ObjectId, required: true, unique: true },
                    spot_number: { type: String, required: true },
                    vehicle_type: { type: String, enum: ["SUV", "SEDAN", "BUS", "TRUCK", "BIKE", "TRIKE", "CYCLE"], required: true }
                }
            ]
        }
    ]
})

module.exports = mongoose.model('Building', buildingSchema); 