const request = require('request')
const properties = require('./properties')

module.exports = {
  fetch: (criteria, callback) => {

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
        'Club': criteria.club,
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

        const classDates = classesResponse['ClassDates'].filter((classDate) => {
          if(!criteria.date){
            return false
          } else {
            const classStartOfDay = new Date(classDate['Date'].match(/\d+/)[0] * 1)
            classStartOfDay.setHours(0,0,0,0)

            return criteria.date.getTime() == classStartOfDay.getTime()
          }
        });

        if(!classDates || classDates.length === 0){
          callback([])
        } else if(classDates.length === 1){
          callback(classDates[0])
        } else {
          throw 'Only up to one class date should match ' + criteria.date
        }
      } else {
        throw '(' + response.statusCode + ') ' + error
      }
    });
  }
}
