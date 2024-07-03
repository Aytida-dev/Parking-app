const Occupency = require("../controllers/occupency.controller")

module.exports = app => {
    app.get("/occupency/:infraId", Occupency.getOccupencyInfo)
}