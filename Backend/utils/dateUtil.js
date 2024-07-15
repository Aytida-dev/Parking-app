
function getCurrentTime(timezone) {
    switch (timezone) {
        case 'IN':
            let date = new Date().getTime()
            date += 5.5 * 60 * 60 * 1000
            return new Date(date)
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