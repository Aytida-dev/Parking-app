const { default: mongoose } = require("mongoose")
const { decryptSpots } = require("../utils/encryptionUtil")
const { checkSpot, getSpotData, unlockSpot } = require("../cache/lock_unlock.cache")
const Building = require("../schema/building.schema")
const runPromise = require("../utils/promiseUtil")
const handleErr = require("../utils/errHandler")
const CustomError = require("../utils/customError")
const Ticket = require("../schema/tickets.schema")
const { createTicketExpiry } = require("../cache/ticket_expiry.cache")
const { changeSpotStatus, findSpotBySpotIds } = require("../models/spot.model")
const { updateBuildingLogs } = require("../models/buildingOccupency.model")

exports.bookTicket = async (req, res) => {
    const { lock_id, owner_name, owner_phone, owner_email, vehicles, rate_type, start } = req.body

    try {

        if (!lock_id || !owner_name || !owner_phone || !vehicles || !rate_type) {
            res.status(400).send({
                message: "Send all the required fields"
            })
            return
        }

        const spots = decryptSpots(lock_id)

        if (!spots.length) {
            res.status(400).send({
                message: "Invalid spot id"
            })
            return
        }

        if (spots.length !== vehicles.length) {
            res.status(400).send({
                message: "Invalid spot id or tried to book different vehicles than locked"
            })
        }

        const buildingOccupency = {}

        const [spots_data, err2] = runPromise(findSpotBySpotIds(spots))

        if (err2) {
            throw new CustomError(err2, 400)
        }

        for (const spot of spots_data) {
            //need change here
            if (!checkSpot(spot.spot_id)) {
                res.status(400).send({
                    message: "Invalid spot id or took too long to book the ticket"
                })
                return
            }

            const { vehicle_type, building_id } = getSpotData(spot.spot_id)

            if (!buildingOccupency[building_id]) {
                buildingOccupency[building_id] = {}
            }

            if (!buildingOccupency[building_id][vehicle_type]) {
                buildingOccupency[building_id][vehicle_type] = 1
            }
            else {
                buildingOccupency[building_id][vehicle_type]++
            }



            for (const vehicle of vehicles) {
                if (vehicle.type === vehicle_type && !vehicle.spot_id && !vehicle.building_id) {
                    vehicle.spot_id = spot
                    vehicle.building_id = building_id
                    break
                }
            }
        }

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

        const tickets = []
        const promiseArr = []

        for (const vehicle of vehicles) {
            const ticket = {
                spot_id: vehicle.spot_id,
                infra_id: infra_id,
                building_id: vehicle.building_id,
                owner_name,
                owner_email,
                owner_phone,
                vehicle_number: vehicle.number,
                vehicle_type: vehicle.type,
                rate_type: rate_type
            }

            if (start) {
                ticket.start_time = new Date()
                promiseArr.push(changeSpotStatus(vehicle.spot_id, "OCCUPIED", vehicle.number))
            }
            else {
                createTicketExpiry(new mongoose.Types.ObjectId(), ticket.spot_id, ticket.vehicle_type, ticket.building_id)
                promiseArr.push(changeSpotStatus(vehicle.spot_id, "BOOKED", vehicle.number))
            }

            tickets.push(ticket)
            unlockSpot(vehicle.spot_id)
        }

        Object.keys(buildingOccupency).forEach(building_id => {
            Object.keys(buildingOccupency[building_id]).forEach(vehicle_type => {
                promiseArr.push(updateBuildingLogs(building_id, vehicle_type, 0, buildingOccupency[building_id][vehicle_type]))
            })
        })

        promiseArr.push(Ticket.insertMany(tickets))

        const [data, err1] = await runPromise(Promise.all(promiseArr))

        if (err1) {
            throw new CustomError("Error validating and creating tickets", 500)
        }

        res.send(data[data.length - 1])

    } catch (error) {
        handleErr(error, res)
    }
}