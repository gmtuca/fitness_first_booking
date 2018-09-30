const today = (plusDays) => {
  const d = new Date()
  d.setDate(d.getDate() + (plusDays ? plusDays : 0))
  d.setHours(0,0,0,0)
  return d
}

module.exports = {
  today: today,
  tomorrow: () => today(+1),
  dayAfterTomorrow: () => today(+2)  
}
