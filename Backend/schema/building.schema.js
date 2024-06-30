const mongoose = require('mongoose');
const { Schema } = mongoose;

const ParkingSpotSchema = new Schema({
    spot_id: { type: Schema.Types.ObjectId, required: true, unique: true },
    spot_name: { type: String, required: true },
    vehicle_type: {
        type: String,
        enum: ["SUV", "SEDAN", "BUS", "TRUCK", "BIKE", "TRIKE", "CYCLE"],
        required: true
    }
}, { _id: false });

const FloorSchema = new Schema({
    floor_number: { type: Number, required: true },
    parking_spots: [ParkingSpotSchema]
});

const BuildingSchema = new Schema({
    parking_infra_id: { type: Schema.Types.ObjectId, ref: 'Infrastructure' },
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
    floors: [FloorSchema]
});

const Building = mongoose.model('Building', BuildingSchema);

module.exports = Building;
