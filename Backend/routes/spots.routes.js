const Spots = require("../controllers/spots.controller")

module.exports = app => {
    app.post("/spots/lockSpots", Spots.lockSpots)

    app.post("/spots/unlockSpots", Spots.unlockSpots)
}