const { default: mongoose } = require("mongoose")
const { decryptSpots } = require("../utils/encryptionUtil")
const { checkSpot, unlockSpot } = require("../cache/lock_unlock.cache")
const runPromise = require("../utils/promiseUtil")
const handleErr = require("../utils/errHandler")
const CustomError = require("../utils/customError")
const Ticket = require("../schema/tickets.schema")
const { createTicketExpiry } = require("../cache/ticket_expiry.cache")
const { changeSpotStatus, findSpotBySpotIds } = require("../models/spot.model")
const { updateBuildingLogs } = require("../models/buildingOccupency.model")
const Infrastructure = require("../schema/infrastructure.schema")

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
            return
        }

        const buildingOccupency = {}

        const [spots_data, err2] = await runPromise(findSpotBySpotIds(spots))

        if (err2) {
            throw new CustomError(err2, 400)
        }

        let vehicle_type_check_count = 0

        for (const spot of spots_data) {
            if (!checkSpot(spot.spot_id)) {
                res.status(400).send({
                    message: "Invalid spot id or took too long to book the ticket"
                })
                return
            }

            const { vehicle_type, building_id } = spot

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
                if (!vehicle.done && vehicle.type === spot.vehicle_type) {
                    spot.vehicle_number = vehicle.number
                    vehicle.done = true
                    vehicle_type_check_count++
                    break
                }
            }

        }

        if (vehicle_type_check_count !== spots_data.length) {
            res.status(400).send({
                message: "Vehicle type other than the locked spot vehicle type for one of the tickets"
            })
            return
        }

        const [infra, err] = await runPromise(
            Infrastructure.findById(
                spots_data[0].infra_id
            )
                .populate("organisation_id")
                .select("name address city state organisation_id")
        )

        if (err) {
            throw new CustomError("Internal server Error while fetching infrastructure", 500)
        }

        if (!infra) {
            throw new CustomError("No building found for this spot", 400)
        }

        const infra_id = spots_data[0].infra_id
        const infra_name = infra.name
        const infra_state = infra.state
        const infra_city = infra.city

        const organisation_name = infra.organisation_id.name

        const tickets = []
        const promiseArr = []

        for (const spot of spots_data) {
            const ticket = {
                spot_id: spot.spot_id,
                spot_name: spot.spot_name,
                infra_id: infra_id,
                infra_name: infra_name,
                infra_state: infra_state,
                infra_city: infra_city,
                organisation_name: organisation_name,
                spot_floor: spot.floor,
                building_id: spot.building_id,
                building_name: spot.building_name,
                owner_name,
                owner_email,
                owner_phone,
                vehicle_number: spot.vehicle_number,
                vehicle_type: spot.vehicle_type,
                rate_type: rate_type
            }

            if (typeof start === "number" && start === 1) {
                ticket.start_time = new Date()
                promiseArr.push(changeSpotStatus(spot.spot_id, "OCCUPIED", spot.vehicle_number))
            }
            else {
                createTicketExpiry(new mongoose.Types.ObjectId(), ticket.spot_id, ticket.vehicle_type, ticket.building_id)
                promiseArr.push(changeSpotStatus(spot.spot_id, "BOOKED", spot.vehicle_number))
            }

            tickets.push(ticket)
            unlockSpot(spot.spot_id)
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