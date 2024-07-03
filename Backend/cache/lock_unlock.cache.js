const lock_cache = {}
const TTL = 10 * 60 * 1000

function lockSpot(spot_id) {
    const expiration_date = Date.now() + TTL
    lock_cache[spot_id] = expiration_date

    setTimeout(() => {
        unlockSpot(spot_id)
    }, TTL)

}

function unlockSpot(spot_id) {
    delete lock_cache[spot_id]
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
