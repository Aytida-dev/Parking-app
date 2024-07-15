const mongoose = require("mongoose");
const { getCurrentTime } = require("../utils/dateUtil");
const { Schema } = mongoose;

const organisationSchema = new Schema({
    name: { type: String, required: true },
    created_at: { type: Date, default: () => getCurrentTime("IN") },
    admin_phone: { type: String, required: true, unique: true },
    admin_email: { type: String, required: true },
    admin_name: { type: String, required: true },
    parking_infra: { type: Number, required: true, default: 0 },
})

const Organisation = mongoose.model('Organisation', organisationSchema);

module.exports = Organisation;