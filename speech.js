module.exports = {
  tellTime: (timeStr) => {
    [hour, minute] = timeStr.split(':')

    if(minute == '00'){
      minute = 'o\'clock'
    }

    return (+hour) + ' ' + minute
  },

  tellDate: (dateStr) => {
    return dateStr.replace(/^0+/, '')
  }
}
