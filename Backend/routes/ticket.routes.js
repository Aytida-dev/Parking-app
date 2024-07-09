const Ticket = require("../controllers/ticket.controller")

module.exports = app => {
    app.post("/ticket/createTicket", Ticket.bookTicket)
    app.post("/ticket/startTicket", Ticket.startTicket)
}