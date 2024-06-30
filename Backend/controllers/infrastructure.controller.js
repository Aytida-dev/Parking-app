const { default: mongoose } = require("mongoose");
const { Infrastructure } = require("../schema/infrastructure.schema");
const { Organisation } = require("../schema/organisation.schema");
const CustomError = require("../utils/customError");
const handleErr = require("../utils/errHandler");
const runPromise = require("../utils/promiseUtil");

exports.create = async (req, res) => {
    const { name, organisation_id, address, state, city, admin_phone, admin_email, admin_name } = req.body;

    if (!name || !organisation_id || !address || !state || !city || !admin_phone || !admin_email || !admin_name) {
        return res.status(400).json({ message: "Please fill all fields" });
    }

    try {

        //update count of infrastructure inside the organisation
        const [org, err1] = await runPromise(Organisation.findByIdAndUpdate(
            organisation_id,
            { $inc: { parking_infra: 1 } },
            { new: true }
        ))

        if (err1) {
            if (err1.name === 'ValidationError') {
                throw new CustomError(err1.message, 400);
            } else {
                throw new CustomError("Internal server error", 500);
            }
        }

        if (!org) {
            throw new CustomError("Organisation not found", 404);
        }

        const newInfra = new Infrastructure(req.body);

        const [infra, err] = await runPromise(newInfra.save());

        if (err) {
            if (err.name === 'MongoError' && err.code === 11000) {
                throw new CustomError(`Infrastructure with admin phone ${admin_phone} already exists`, 400);
            }

            else if (err.name === "ValidationError") {
                throw new CustomError(err.message, 400);
            }

            else {
                throw new CustomError("Internal server error", 500);
            }
        }


        res.send({ ...infra.toObject() })


    } catch (error) {
        handleErr(error, res)
    }
}

exports.getAll = async (req, res) => {
    const { organId } = req.params
    if (!organId) {
        res.status(400).send({
            message: "Organisation id is required"
        })
    }

    if (!mongoose.Types.ObjectId.isValid(organId)) {
        return res.status(400).json({ message: "Invalid organisation ID" });
    }

    try {
        const [infra, err] = await runPromise(Infrastructure.find({
            organisation_id: organId
        }))

        if (err) {
            throw new CustomError('Internal server error', 500);
        }

        res.status(200).send({
            message: `Infrastructures for organisation id : ${organId} fetched successfully`,
            infrastructures: infra
        });
    } catch (error) {
        handleErr(error, res)
    }
}