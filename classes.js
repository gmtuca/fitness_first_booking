const request = require('request')
const properties = require('./properties')
const assert = require('assert')

const ANY_CLASS = '-1'

module.exports = {
  fetch: (criteria, callback) => {

    if(!criteria.class){
      criteria.class = ANY_CLASS
    }

    console.log('Fetching list of classes based on criteria', criteria)

    request.post({
      url: 'https://www.dwfitnessfirst.com/umbraco/surface/classessurface/getbookingclassesbydate/',
      headers: {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-GB,en;q=0.9,en-US;q=0.8,it;q=0.7,pt;q=0.6',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'yourAuthCookie=' + properties.authCookie,
        'Host': 'www.dwfitnessfirst.com',
        'Origin': 'https://www.dwfitnessfirst.com',
        'Referer': 'https://www.dwfitnessfirst.com/classes-facilities/fitness-classes/timetable/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest'
      },
      form: {
        'Club': properties.club,
        'Member': properties.member_id,
        'Random': Math.floor(Math.random() * Math.pow(2, 31)).toString(),
        'Class': criteria.class
      }
    }, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        console.log(body)

        const classesResponse = JSON.parse(body)

        if(!classesResponse['Success']){
          throw 'Classes response was unsuccessful. ' + classesResponse['Message']
        }

        let classDates = classesResponse['ClassDates'];

        if(criteria.date){
          classDates = classDates.filter((classDate) => {
            const classStartOfDay = new Date(classDate['Date'].match(/\d+/)[0] * 1)
            classStartOfDay.setHours(0,0,0,0)

            return criteria.date.getTime() == classStartOfDay.getTime()
          });
        }

        if(criteria.booked){ //TODO fitness first bug - all bookings have 'Booked' = false
          classDates.forEach((classDate) => {
            classDate['Classes'] = classDate['Classes'].filter((aClass) => {
              if(Math.floor(Math.random() * 16) == 5){ //TODO remove
                return true
              }
              return aClass['Booked'] == true
            })
          })

          classDates = classDates.filter((classDate) => classDate['Classes'].length > 0)
        }

        callback(classDates)
      } else {
        throw '(' + response.statusCode + ') ' + error
      }
    });
  }
}
