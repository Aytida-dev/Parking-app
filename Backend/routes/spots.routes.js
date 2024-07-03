const Spots = require("../controllers/spots.controller")

module.exports = app => {
    app.get("/spots/lockSpots", Spots.lockSpots)
}