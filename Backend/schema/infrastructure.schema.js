const mongoose = require("mongoose");
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
        lat: { type: Number, required: true },
        long: { type: Number, required: true }
    },
    created_at: { type: Date, default: Date.now },
    // worker_id: { type: Schema.Types.ObjectId, ref: 'Worker' },
    buildings: { type: Number, required: true }

})

const Infrastructure = mongoose.model('Infrastructure', infrastructureSchema);
module.exports = { Infrastructure }