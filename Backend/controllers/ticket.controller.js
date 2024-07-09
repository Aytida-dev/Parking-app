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
    const { lock_id, owner_name, owner_phone, owner_email, vehicles, start } = req.body

    try {

        if (!lock_id || !owner_name || !owner_phone || !vehicles) {
            throw new CustomError("Owner name, phone, vehicles and lock id are required", 400)
        }

        const spots = decryptSpots(lock_id)

        if (!spots.length) {
            throw new CustomError("Invalid lock id", 400)
        }

        if (spots.length !== vehicles.length) {
            throw new CustomError("Invalid spot id or tried to book different vehicles than locked", 400)
        }

        const buildingOccupency = {}

        const [spots_data, err2] = await runPromise(findSpotBySpotIds(spots))

        if (err2) {
            throw new CustomError(err2, 400)
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

        let vehicle_type_check_count = 0

        for (const spot of spots_data) {
            if (!checkSpot(spot.spot_id)) {
                throw new CustomError("Invalid spot id or took too long to book the ticket", 400)
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
                if (vehicle.done) continue

                if (vehicle.rate_type !== "HOURLY" && vehicle.rate_type !== "DAILY") {
                    throw new CustomError("Invalid rate type", 400)
                }

                if (start === 1 && !vehicle.number) {
                    throw new CustomError("Vehicle number is required for Starting the parking", 400)
                }

                if (!vehicle.done && vehicle.type === spot.vehicle_type) {
                    spot.vehicle_number = vehicle.number
                    spot.rate_type = vehicle.rate_type
                    vehicle.done = true
                    vehicle_type_check_count++
                    break
                }

            }

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
                rate_type: spot.rate_type
            }

            if (typeof start === "number" && start === 1) {
                ticket.start_time = new Date()
                promiseArr.push(() => changeSpotStatus(spot.spot_id, "OCCUPIED", spot.vehicle_number))
            }
            else {
                createTicketExpiry(new mongoose.Types.ObjectId(), ticket.spot_id, ticket.vehicle_type, ticket.building_id)
                promiseArr.push(() => changeSpotStatus(spot.spot_id, "BOOKED"))
            }

            tickets.push(ticket)
            unlockSpot(spot.spot_id)

        }

        if (vehicle_type_check_count !== spots_data.length) {
            throw new CustomError("Vehicle type other than the locked spot vehicle type for one of the tickets", 400)
        }

        Object.keys(buildingOccupency).forEach(building_id => {
            Object.keys(buildingOccupency[building_id]).forEach(vehicle_type => {
                promiseArr.push(() => updateBuildingLogs(building_id, vehicle_type, 0, buildingOccupency[building_id][vehicle_type]))
            })
        })

        promiseArr.forEach((fn) => fn())

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