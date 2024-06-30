const Building = require("../controllers/building.controller")

module.exports = app => {
    app.post("/building", Building.create)

    app.get("/building/:infraId", Building.getAll)
}