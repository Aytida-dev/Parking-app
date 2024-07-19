const { verifyWorkerId } = require("../controllers/login.controller")
const CustomError = require("../utils/customError")
const handleErr = require("../utils/errHandler")
const runPromise = require("../utils/promiseUtil")

exports.verifyWorker = async (req, res, next) => {
    try {
        const { worker_id } = req.body

        const [worker, err] = await runPromise(verifyWorkerId(worker_id))

        if (err) {
            if (err === "Internal server error") {
                throw new CustomError(err, 500)
            }
            else {
                throw new CustomError(err, 404)
            }
        }
        req.infra_id = worker.infra_id
        next()
    } catch (error) {
        handleErr(error, res)
    }
}