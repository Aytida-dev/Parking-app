const Ticket = require("../controllers/ticket.controller")
const worker_auth = require("../middlewares/worker_auth")

module.exports = app => {
    app.post("/ticket/createTicket", Ticket.bookTicket)
    app.post("/ticket/startTicket", worker_auth.verifyWorker, Ticket.startTicket)
    app.post("/ticket/endTicket/:ticket_id", worker_auth.verifyWorker, Ticket.endTicket)
}