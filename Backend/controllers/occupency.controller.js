const { default: mongoose } = require("mongoose")
const Building_Occupency_Logs = require("../schema/building_occupency_logs.schema")
const CustomError = require("../utils/customError")
const handleErr = require("../utils/errHandler")
const runPromise = require("../utils/promiseUtil")

exports.getOccupencyInfo = async (req, res) => {
    const { infraId } = req.params

    if (!infraId) {
        return res.status(400).send({
            message: "Infrastructure id is required"
        })
    }

    if (!mongoose.Types.ObjectId.isValid(infraId)) {
        return res.status(400).send({
            message: "Invalid Infrastructure id"
        })
    }

    try {
        const [occupencyInfo, err] = await runPromise(Building_Occupency_Logs.find({
            infra_id: infraId

        })
            .populate('infra_id', "rates")
        )

        if (err) {
            if (err.name == "CastError") {
                throw new CustomError("Invalid Infrastructure id", 400)
            }
            else {
                throw new CustomError("Internal server error", 500)
            }

        }

        if (!occupencyInfo || !occupencyInfo.length) {
            throw new CustomError("Invalid infrastructure id or infrastructure have no buildings", 404)
        }


        let rates = occupencyInfo[0].infra_id.rates
        rates = Object.fromEntries(rates.entries())
        const response = {}

        occupencyInfo.map((building) => {
            const spot_logs = Object.fromEntries(building.spots_log.entries())

            Object.keys(rates).map((car_type) => {
                if (response[car_type] && spot_logs[car_type]) {

                    const prevObj = response[car_type]
                    prevObj.total += spot_logs[car_type].total
                    prevObj.occupied += spot_logs[car_type].occupied
                    prevObj.locked += spot_logs[car_type].locked
                    prevObj.available = prevObj.total - prevObj.occupied - prevObj.locked

                    response[car_type] = prevObj
                }
                else if (spot_logs[car_type]) {

                    response[car_type] = {
                        HOURLY: rates[car_type].HOURLY,
                        DAILY: rates[car_type].DAILY,
                        total: spot_logs[car_type].total,
                        occupied: spot_logs[car_type].occupied,
                        locked: spot_logs[car_type].locked,
                        available: spot_logs[car_type].total - spot_logs[car_type].occupied - spot_logs[car_type].locked
                    }
                }
            })
        })

        res.send(response)

    } catch (error) {
        handleErr(error, res)
    }
}