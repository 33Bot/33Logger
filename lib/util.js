function generateId(length){
    const uidsChars = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "1", "2", "3", "4", "5", "7", "8", "9"];
    let result = "";

    for(let i = 0; i < length; i++){
        const randomNumber = Math.floor((Math.random() * uidsChars.length))
        result += uidsChars[randomNumber]
    }

    return result
}

function generateDataForPlaceholder({message, id, name, logName}, DateFormater=DefaultDateFormater){
    const time = new Date()
    const timeFormated = DateFormater.format(time);
    return {
        logName: logName,
        name: name,
        id: id,
        time: timeFormated,
        rawTime: time,
        message: message
    }
}

const DefaultDateFormater = new Intl.DateTimeFormat([], {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
})

const colors = {
    Red: "\x1b[31m%s\x1b[0m",
    Yellow: "\x1b[33m%s\x1b[0m",
    White: "\x1b[37m%s\x1b[0m"
}

module.exports = {
    generateId,
    generateDataForPlaceholder,
    colors,
    DefaultDateFormater
}