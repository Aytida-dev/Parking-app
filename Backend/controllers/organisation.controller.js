const { Organisation } = require("../schema/organisation.schema");
const CustomError = require("../utils/customError");
const handleErr = require("../utils/errHandler");
const runPromise = require("../utils/promiseUtil");

exports.create = async (req, res) => {
    const { name, admin_phone, admin_email, admin_name, parking_infra } = req.body;

    if (!name || !admin_phone || !admin_email || !admin_name) {
        return res.status(400).send({
            message: 'Please provide all required fields'
        });
    }

    try {
        const organisation = new Organisation({
            name,
            admin_phone,
            admin_email,
            admin_name,
            parking_infra
        });

        const [newOrg, err] = await runPromise(organisation.save());

        if (err) {
            if (err.name === 'MongoServerError' && err.code === 11000) {
                throw new CustomError(`Organisation with admin phone ${admin_phone} already exists`, 400)
            }

            else if (err.name === 'ValidationError') {
                throw new CustomError(err.message, 400)
            }
            else {
                throw new CustomError('Internal server error', 500)
            }
        }

        newOrg.toObject();

        res.status(201).send({
            message: `Organisation created successfully`,
            organisation: newOrg
        });
    }
    catch (err) {
        handleErr(err, res);
    }
}

exports.getAll = async (req, res) => {
    try {
        const [organisations, err] = await runPromise(Organisation.find({}));

        if (err) {
            throw new CustomError('Internal server error', 500);
        }

        res.status(200).send({
            message: 'Organisations fetched successfully',
            organisations
        });
    }
    catch (err) {
        handleErr(err, res);
    }
}