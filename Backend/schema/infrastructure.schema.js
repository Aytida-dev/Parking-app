const mongoose = require("mongoose");
const { getCurrentTime } = require("../utils/dateUtil");
const Schema = mongoose.Schema;

const infrastructureSchema = new Schema({
    name: { type: String, required: true },
    organisation_id: { type: Schema.Types.ObjectId, ref: 'Organisation' },
    address: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    admin_phone: { type: String, required: true },
    admin_email: { type: String, required: true },
    admin_name: { type: String, required: true },
    coordinates: {
        lat: { type: Number, required: false },
        long: { type: Number, required: false }
    },
    rates: {
        type: Map,
        of: {
            HOURLY: { type: Number, required: true },
            DAILY: { type: Number, required: true }
        }
    },
    created_at: { type: Date, default: () => getCurrentTime("IN") },
    // worker_id: { type: Schema.Types.ObjectId, ref: 'Worker' },
    buildings: { type: Number, required: true, default: 0 },

})

const Infrastructure = mongoose.model('Infrastructure', infrastructureSchema);
module.exports = Infrastructure 