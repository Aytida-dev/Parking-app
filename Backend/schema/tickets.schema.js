const mongoose = require("mongoose");
const { Schema } = mongoose;


const ticketSchema = new Schema({
    spot_id: { type: Schema.Types.ObjectId, required: true },
    spot_name: { type: String, required: true },
    building_id: { type: Schema.Types.ObjectId, required: true, ref: 'Building' },
    building_name: { type: String, required: true },
    infra_id: { type: Schema.Types.ObjectId, required: true, ref: 'Infrastructure' },
    infra_name: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    owner_name: { type: String, required: true },
    owner_phone: { type: String, required: true },
    owner_email: { type: String },
    vehicle_number: { type: String, required: true },
    vehicle_type: { type: String, enum: ["SUV", "SEDAN", "BUS", "TRUCK", "BIKE", "TRIKE", "CYCLE"], required: true },
    rate_type: { type: String, enum: ["HOURLY", "DAILY"], required: true },
    start_time: { type: Date, required: false },
    end_time: { type: Date, required: false },
    total_amount: { type: Number, required: false },
    payment_type: { type: String, enum: ["CASH", "CARD", "UPI"], required: false }
})

const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket