const { updateBuildingLogs } = require("../models/buildingOccupency.model")
const { changeSpotStatus } = require("../models/spot.model")
const Ticket = require("../schema/tickets.schema")

const ticket_cache = {}
const TTL = 1 * 60 * 60 * 1000

function createTicketExpiry(ticket_id, spot_id, vehicle_type, building_id) {
    if (ticket_cache[ticket_id]) {
        throw new Error("Ticket already exists")
    }

    const expiry = new Date(Date.now() + TTL)

    ticket_cache[ticket_id] = { expiry, spot_id, vehicle_type, building_id }
}

function deleteTicket(ticket_id) {
    delete ticket_cache[ticket_id]
}



async function ticketCronJob() {
    const now = new Date()

    for (const ticket_id in ticket_cache) {
        const { expiry, spot_id, vehicle_type, building_id } = ticket_cache[ticket_id]
        if (expiry < now) {

            await Promise.all([Ticket.findByIdAndUpdate(ticket_id, { expired: true }), changeSpotStatus(spot_id, "VACANT"), updateBuildingLogs(building_id, vehicle_type, -1, 0)])
                .catch((err) => {
                    console.log(err)
                })

            deleteTicket(ticket_id)
        }
    }
}

module.exports = {
    createTicketExpiry, deleteTicket, ticketCronJob
}