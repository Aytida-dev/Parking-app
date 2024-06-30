const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const buildingOccupencyLogSchema = new Schema({

    building_id: { type: Schema.Types.ObjectId, ref: 'Building', unique: true },
    spots_log: {
        type: Map,
        of: {
            total: { type: Number, required: true },
            occupied: { type: Number, required: true, default: 0 },
            booked: { type: Number, required: false, default: 0 }
        }
    }

})

const Building_Occupency_Logs = mongoose.model('BuildingOccupencyLog', buildingOccupencyLogSchema);
module.exports = Building_Occupency_Logs