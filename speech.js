module.exports = {
  tellTime: (timeStr) => {
    [hour, minute] = timeStr.split(':')

    if(minute == '00'){
      minute = 'o\'clock'
    }

    return (+hour) + ' ' + minute
  },

  tellDate: (dateStr) => {
    [dayOfTheWeek, dayOfTheMonth] = dateStr.split(' ')
    return dayOfTheWeek + ' ' + dayOfTheMonth.replace(/^0+/, '')
  }
}
