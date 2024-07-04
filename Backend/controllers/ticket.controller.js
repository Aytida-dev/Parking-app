const { default: mongoose } = require("mongoose")
const { decryptSpots } = require("../utils/encryptionUtil")
const { checkSpot, getSpotData } = require("../cache/lock_unlock.cache")
const Building = require("../schema/building.schema")
const runPromise = require("../utils/promiseUtil")
const handleErr = require("../utils/errHandler")
const CustomError = require("../utils/customError")
const Ticket = require("../schema/tickets.schema")

exports.bookTicket = async (req, res) => {
    const { lock_id, owner_name, owner_number, vehicles, rate_type } = req.body

    if (!lock_id || !owner_name || !owner_number || !vehicles || !rate_type) {
        res.status(400).send({
            message: "Send all the required fields"
        })
        return
    }

    const spots = decryptSpots(lock_id)

    if (spots.length) {
        res.status(400).send({
            message: "Invalid spot id"
        })
        return
    }

    for (const spot of spots) {
        if (!mongoose.Types.ObjectId.isValid(spot) || !checkSpot(spot)) {
            res.status(400).send({
                message: "Invalid spot id or took too long to book the ticket"
            })
            return
        }
    }

    try {
        const [building, err] = await runPromise(
            Building.findById(
                getSpotData(spots[0]).building_id
            )
                .select("parking_infra_id")
        )

        if (err) {
            throw new CustomError("Internal server Error while fetching buildings", 500)
        }

        if (!building) {
            throw new CustomError("No building found for this spot", 400)
        }

        const infra_id = building.parking_infra_id

    } catch (error) {
        handleErr(error, res)
    }


}