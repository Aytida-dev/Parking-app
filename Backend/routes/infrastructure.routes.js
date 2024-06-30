const Infrastructure = require("../controllers/infrastructure.controller")
module.exports = app => {
    app.get("/infrastructure/:organId", Infrastructure.getAll)
    app.post("/infrastructure", Infrastructure.create)

}