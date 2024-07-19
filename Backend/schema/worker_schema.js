const mongoose = require('mongoose')
const Schema = mongoose.Schema

const workerSchema = new Schema({
    worker_id: { type: String, unique: true, required: true },
    infra_id: { type: Schema.Types.ObjectId, ref: 'Infrastructure' },
})

const Worker = mongoose.model('Worker', workerSchema)
module.exports = Worker