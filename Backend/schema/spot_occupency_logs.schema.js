const mongoose = require("mongoose")
const { Schema } = mongoose

const spotOccupencyLogSchema = new Schema({
    spot_id: { type: Schema.Types.ObjectId, unique: true, required: true },
    status: { type: String, enum: ["OCCUPIED", "BOOKED", "VACANT"], required: true, default: "VACANT" },
    vehicle_number: { type: Number, required: false, unique: true },
})

module.exports = mongoose.model('SpotOccupencyLog', spotOccupencyLogSchema);