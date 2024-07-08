const { updateBuildingLogs } = require("../models/buildingOccupency.model")

const lock_cache = {}
const TTL = 10 * 60 * 1000

function lockSpot(spot_id, building_id, vehicle_type) {
    if (lock_cache[spot_id]) {
        throw new Error("Spot already locked")
    }

    const timeoutId = setTimeout(() => {
        unlockSpot_auto(spot_id)
    }, TTL)

    lock_cache[spot_id] = { timeoutId, building_id, vehicle_type }

    setImmediate(() => {
        updateBuildingLogs(building_id, vehicle_type, 1, 0)
    })

}

function unlockSpot(spot_id) {
    const { timeoutId, building_id, vehicle_type } = lock_cache[spot_id]
    delete lock_cache[spot_id]

    if (!timeoutId || !building_id || !vehicle_type) return

    clearTimeout(timeoutId)

    setImmediate(() => {
        updateBuildingLogs(building_id, vehicle_type, -1, 0)
    })
}

function unlockSpot_auto(spot_id) {
    const { timeoutId, building_id, vehicle_type } = lock_cache[spot_id]
    delete lock_cache[spot_id]

    if (!timeoutId || !building_id || !vehicle_type) return

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

function getSpotData(spot_id) {
    return lock_cache[spot_id]
}

module.exports = {
    lockSpot, unlockSpot, getAllLocks, checkSpot, getSpotData
}
