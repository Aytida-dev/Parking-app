function getCurrentTime(timezone) {
    switch (timezone) {
        case 'IN':
            const dateString = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
            return new Date(dateString)
    }
}

function getTimeDifference(startTime, endTime) {
    const difference = endTime.getTime() - startTime.getTime()
    return difference / (1000 * 60 * 60)
}

module.exports = {
    getCurrentTime,
    getTimeDifference
}