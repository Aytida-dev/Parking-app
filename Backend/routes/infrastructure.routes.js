const Infrastructure = require("../controllers/infrastructure.controller")
module.exports = app => {
    app.get("/infrastructure/:organId", Infrastructure.getAll)
    app.post("/infrastructure", Infrastructure.create)
    app.post("/infrastructure/createWorker/:infra_id", Infrastructure.createWorkerId)
    app.delete("/infrastructure/deleteWorker/:worker_id", Infrastructure.invalidateWorkerId)

}