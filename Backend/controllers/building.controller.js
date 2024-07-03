const { default: mongoose } = require("mongoose")
const Building = require("../schema/building.schema")
const Building_Occupency_Logs = require("../schema/building_occupency_logs.schema")
const handleErr = require("../utils/errHandler")
const runPromise = require("../utils/promiseUtil")
const CustomError = require("../utils/customError")

exports.create = async (req, res) => {

    // res.send("enable to add dummy data")

    const data = {
        parking_infra_id: "668274c11070e6ac0d3cfe06",
        name: "Building 2",
        allowed_vehicles: ["SEDAN", "BIKE"],

        floors: [
            {
                floor_number: 0,
                parking_spots: [
                    {
                        spot_id: new mongoose.Types.ObjectId(),
                        spot_name: "B0-001",
                        vehicle_type: "BIKE",
                    },
                    {
                        spot_id: new mongoose.Types.ObjectId(),
                        spot_name: "B0-002",
                        vehicle_type: "BIKE",
                    },
                    {
                        spot_id: new mongoose.Types.ObjectId(),
                        spot_name: "B0-003",
                        vehicle_type: "BIKE",
                    }
                ]
            },
            {
                floor_number: 1,
                parking_spots: [
                    {
                        spot_id: new mongoose.Types.ObjectId(),
                        spot_name: "A1-001",
                        vehicle_type: "SEDAN",
                    },
                    {
                        spot_id: new mongoose.Types.ObjectId(),
                        spot_name: "A1-002",
                        vehicle_type: "SEDAN",
                    },
                    {
                        spot_id: new mongoose.Types.ObjectId(),
                        spot_name: "A1-003",
                        vehicle_type: "SEDAN",
                    }
                ]
            }
        ]
    }

    try {

        const building = new Building(data)

        const newBuild = await building.save()
        console.log("building created");

        newBuild.toObject()

        const occupencyLogs = {
            building_id: newBuild._id,
            infra_id: newBuild.parking_infra_id,
            spots_log: {
                SEDAN: { total: 3 },
                BIKE: { total: 3 }
            }
        }

        const newOccup = new Building_Occupency_Logs(occupencyLogs)

        await newOccup.save()
        console.log("building occupency created");

        // console.log(spotLogs);

        res.send("done")
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            err
        })
    }



}

exports.getAll = async (req, res) => {
    const { infraId } = req.params

    if (!infraId) {
        res.status(400).send({
            message: "Infrastructure Id is required"
        })

        return
    }

    if (!mongoose.Types.ObjectId.isValid(infraId)) {
        res.status(400).send({
            message: "Infrastructure id is not valid"
        })
    }

    try {
        const [buildings, err] = await runPromise(Building.find({
            parking_infra_id: infraId
        }))

        if (err) {
            throw new CustomError('Internal server error', 500);
        }

        res.status(200).send({
            message: `Buildings for Infrastructure id : ${infraId} fetched successfully`,
            buildings: buildings
        });
    } catch (error) {
        handleErr(error, res)
    }
}