const Organisation = require("../controllers/organisation.controller");

module.exports = app => {
    app.get("/organisation", Organisation.getOrganisations);
    app.post("/organisation", Organisation.createOrganisation);
}