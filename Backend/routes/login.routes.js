const Login = require("../controllers/login.controller")

module.exports = app => {
    app.post("/worker/login", Login.workerLogin)
}