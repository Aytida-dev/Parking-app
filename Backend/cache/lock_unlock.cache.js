const { updateBuildingLogs } = require("../models/buildingOccupency.model")

const lock_cache = {}
const TTL = 10 * 60 * 1000

function lockSpot(spot_id, building_id, vehicle_type) {
    if (lock_cache[spot_id]) {
        throw new Error("Spot already locked")
    }

    const expiration_date = Date.now() + TTL
    lock_cache[spot_id] = { expiration_date, building_id, vehicle_type }

    setTimeout(() => {
        unlockSpot(spot_id)
    }, TTL)

    setImmediate(() => {
        updateBuildingLogs(building_id, vehicle_type, 1, 0)
    })

}

function unlockSpot(spot_id) {
    const { building_id, vehicle_type } = lock_cache[spot_id]
    delete lock_cache[spot_id]

    if (!building_id || !vehicle_type) return

    setImmediate(() => {
        updateBuildingLogs(building_id, vehicle_type, -1, 0)
    })
}

function getAllLocks() {
    return Object.keys(lock_cache)
}

function checkSpot(spot_id) {
    return lock_cache[spot_id] ? true : false
}

module.exports = {
    lockSpot, unlockSpot, getAllLocks, checkSpot
}
