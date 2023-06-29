const { autoAddEvents } = require('./autoAddEvents')
const { Scrapper } = require('../scrapper/scrapper.js')

const intervals = {}

const stopInterval = async (guild, calId) => {
    //console.log('calId', calId)
    if (intervals[guild.id] && intervals[guild.id][calId]) {
        clearInterval(intervals[guild.id][calId])
        delete intervals[guild.id][calId]
        //console.log(intervals)
    }
}

const startInterval = async (guild, calLimit, calUrl, calId, i = 1 * 60 * 1000) => {
    let intervalRef = setInterval(async () => {
        //console.log(calUrl)
        const scrapper = new Scrapper(calLimit, calUrl);
        let eventLinksArr = await scrapper.scrapCalendar(calUrl)
        await autoAddEvents(guild, eventLinksArr)
    }, i)
    if (intervals[guild.id]) {
        intervals[guild.id][calId] = intervalRef
    }
    else {
        intervals[guild.id] = {
            [calId]: intervalRef
        }
    }
}

module.exports = { stopInterval, startInterval, intervals }