const Worker = require("../schema/worker_schema")
const CustomError = require("../utils/customError")
const handleErr = require("../utils/errHandler")
const runPromise = require("../utils/promiseUtil")

exports.workerLogin = async (req, res) => {
    try {
        const { worker_id } = req.body

        const [worker, err] = await runPromise(verifyWorkerId(worker_id))

        if (err) {
            if (err.message === "Internal server error") {
                throw new CustomError(err.message, 500)
            }

            throw new CustomError(err.message, 404)

        }

        res.send({
            message: "Worker verified successfully",
            worker_id: worker.worker_id,
            infra_id: worker.infra_id
        })

    } catch (error) {
        handleErr(error, res)
    }
}

const verifyWorkerId = async (worker_id) => {

    if (!worker_id) {
        throw new Error("Worker id is required")
    }

    const [worker, err] = await runPromise(Worker.findOne({ worker_id }))

    if (err) {
        throw new Error("Internal server error")
    }

    if (!worker) {
        throw new Error(`Worker with id ${worker_id} not found`)
    }

    return worker

}
exports.verifyWorkerId = verifyWorkerId