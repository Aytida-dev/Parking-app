const Ticket = require("../controllers/ticket.controller")

module.exports = app => {
    app.post("/ticket/createTicket", Ticket.bookTicket)
    app.post("/ticket/startTicket", Ticket.startTicket)
    app.post("/ticket/endTicket/:ticket_id", Ticket.endTicket)
}