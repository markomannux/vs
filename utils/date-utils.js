function convertToDateString(d) {
    let year, month, date
    ({year, month, date} = dateTokens(d))

    return `${year}-${month}-${date}`
}

function formatDate(d) {
    let year, month, date
    ({year, month, date} = dateTokens(d))

    return `${date}/${month}/${year}`
}

function dateTokens(d) {
    return {
        year: d.getFullYear(),
        month: padDateElement(d.getMonth() + 1),
        date: padDateElement(d.getDate())
    }
}

function padDateElement(elem)  {
    return elem.toString().padStart(2, '0')
}

module.exports = {
    convertToDateString,
    formatDate
}