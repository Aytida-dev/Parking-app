const { default: mongoose } = require("mongoose")
const { getOccupantBuilding } = require("../models/buildingOccupency.model")
const findAndLockSpots = require("../models/spot.model")
const CustomError = require("../utils/customError")
const handleErr = require("../utils/errHandler")
const runPromise = require("../utils/promiseUtil")
const { unlockSpot } = require("../cache/lock_unlock.cache")
const { encryptSpots, decryptSpots } = require("../utils/encryptionUtil")

exports.lockSpots = async (req, res) => {
    const { infra_id, requirements } = req.body

    if (!infra_id, !requirements || typeof requirements !== "object") {
        res.status(400).send({
            message: "infrastructure ID and spots requirements are required"
        })
        return
    }

    if (!mongoose.Types.ObjectId.isValid(infra_id)) {
        res.status(400).send({
            message: "Invalid infrastructure id"
        })
        return
    }

    try {
        const promiseArr = Object.keys(requirements).map((car_type) => {
            return getOccupantBuilding(infra_id, car_type)
        })

        const [buildingOccupencyData, err] = await runPromise(Promise.all(promiseArr))

        if (err) {
            throw new CustomError("Error while fetching occupant building please check your params", 500)
        }

        const [spots, err1] = await runPromise(findAndLockSpots(requirements, buildingOccupencyData))

        if (err1) {
            throw new CustomError(err1, 500)
        }

        const lock_id = encryptSpots(spots)

        res.send({
            lock_id
        })
    } catch (error) {
        handleErr(error, res)
    }
}

exports.unlockSpots = async (req, res) => {
    const { lock_id } = req.body

    if (!lock_id) {
        res.status(400).send({
            message: "Lock id is required"
        })
        return
    }

    const spots = decryptSpots(lock_id)

    if (!spots.length) {
        res.status(400).send({
            message: "Invalid lock id"
        })
    }

    spots.map((spot) => {
        unlockSpot(spot)
    })

    res.send({
        message: "All spots unlocked"
    })
}