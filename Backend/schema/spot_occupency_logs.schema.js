const mongoose = require("mongoose")
const { Schema } = mongoose

const spotOccupencyLogSchema = new Schema({
    spot_id: { type: Schema.Types.ObjectId, unique: true, required: true },
    status: { type: String, enum: ["OCCUPIED", "BOOKED", "VACANT"], required: true, default: "VACANT" },
    vehicle_number: { type: Number, required: false, default: null },
})

const Spot_Occupency_logs = mongoose.model('SpotOccupencyLog', spotOccupencyLogSchema);
module.exports = Spot_Occupency_logs;