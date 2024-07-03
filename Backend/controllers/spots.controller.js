const { getOccupantBuilding } = require("../models/buildingOccupency.model")

exports.lockSpots = async (req, res) => {
    const egData = {
        infra_id: "668274c11070e6ac0d3cfe06",
        requirements: { SUV: 2, BIKE: 1 }
    }

    try {
        const data = await getOccupantBuilding(egData.infra_id, "SUV")
        res.send(data)
    } catch (error) {
        res.send(error)
    }
}