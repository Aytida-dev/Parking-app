const { verifyWorkerId } = require("../controllers/login.controller");
const runPromise = require("./promiseUtil");

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateRandomString(length) {
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

async function generateWorkerId() {
    let isUnique = false

    while (!isUnique) {
        const workerId = generateRandomString(6)
        const [_, err] = await runPromise(verifyWorkerId(workerId))

        if (err === `Worker with id ${workerId} not found`) {
            isUnique = true
            return workerId
        }
        else if (err === "Internal server error") {
            throw new Error("Internal server error")
        }

    }
}

module.exports = generateWorkerId;