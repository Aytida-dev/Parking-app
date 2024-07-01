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
            .populate('building_id', "rates")
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
            throw new CustomError("Invalid infrastructure id", 404)
        }

        res.send(occupencyInfo)

    } catch (error) {
        handleErr(error, res)
    }
}