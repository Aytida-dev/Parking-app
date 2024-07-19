const CustomError = require("../utils/customError")
const handleErr = require("../utils/errHandler")

exports.workerLogin = async (req, res) => {
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

        res.send({
            message: "Worker verified successfully",
            worker_id: worker.worker_id,
            infra_id: worker.infra_id
        })

    } catch (error) {
        handleErr(error, res)
    }
}

exports.verifyWorkerId = async (worker_id) => {

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