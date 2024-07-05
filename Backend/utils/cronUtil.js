const cron = require("node-cron")
const { ticketCronJob } = require("../cache/ticket_expiry.cache")

cron.schedule("*/10 * * * *", async () => {
    await ticketCronJob()
})