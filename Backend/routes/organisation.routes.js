const Organisation = require("../controllers/organisation.controller");

module.exports = app => {
    app.get("/organisation", Organisation.getAll);
    app.post("/organisation", Organisation.create);
}