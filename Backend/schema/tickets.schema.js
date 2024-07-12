const mongoose = require("mongoose");
const { getCurrentTime } = require("../utils/dateUtil");
const { Schema } = mongoose;


const ticketSchema = new Schema({
    ticket_id: { type: Schema.Types.ObjectId, required: true, unique: true },
    spot_id: { type: Schema.Types.ObjectId, required: true },
    spot_floor: { type: Number, required: true },
    spot_name: { type: String, required: true },
    building_id: { type: Schema.Types.ObjectId, required: true, ref: 'Building' },
    building_name: { type: String, required: true },
    infra_id: { type: Schema.Types.ObjectId, required: true, ref: 'Infrastructure' },
    infra_name: { type: String, required: false },
    expired: { type: Boolean, default: false },
    infra_state: { type: String, required: false },
    infra_city: { type: String, required: false },
    organisation_name: { type: String, required: false },
    created_at: { type: Date, default: () => getCurrentTime("IN") },
    owner_name: { type: String, required: true },
    owner_phone: { type: String, required: true },
    owner_email: { type: String },
    vehicle_number: { type: String, required: false, default: null },
    vehicle_type: { type: String, enum: ["SUV", "SEDAN", "BUS", "TRUCK", "BIKE", "TRIKE", "CYCLE"], required: true },
    rate_type: { type: String, enum: ["HOURLY", "DAILY"], required: true },
    start_time: { type: Date, required: false },
    end_time: { type: Date, required: false },
    parking_duration: { type: Number, required: false },
    rates: { type: Map, of: { HOURLY: { type: Number, required: false }, DAILY: { type: Number, required: false } }, required: true },
    total_amount: { type: Number, required: false },
    payment_type: { type: String, enum: ["CASH", "CARD", "UPI"], required: false }
}, { _id: false })

const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket