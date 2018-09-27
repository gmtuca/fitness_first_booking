/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

'use strict';

const Alexa = require('alexa-sdk')
const classes = require('./classes')
const speech = require('./speech')
const assert = require('assert')

const APP_ID = 'amzn1.ask.skill.01b29b73-41cc-4ac0-8563-b6d5c82753e1';

const SKILL_NAME = 'Fitness First';
const HELP_MESSAGE = 'You can ask me to make a new booking, view your bookings or cancel them. Keep it up, you cheeky bastard!';
const HELP_REPROMPT = 'Sorry mate, do you need a spot?';
const STOP_MESSAGE = 'See you after the work out!';

const today = (plusDays) => {
  const d = new Date()
  d.setDate(d.getDate() + (plusDays ? plusDays : 0))
  d.setHours(0,0,0,0)
  return d
}

const tomorrow = () => {
  return today(+1)
}

const dayAfterTomorrow = () => {
  return today(+2)
}

const fetchBooked = (criteria, callback) => {
  assert(criteria.booked)

  classes.fetch(criteria, (classDates) => {
    let responseText;

    if(classDates.length === 0){
      responseText = 'You have no bookings for this ' + (criteria.date ? 'date ' : 'week') + '.'
    } else if(classDates.length === 1 && classDates[0]['Classes'].length === 1){
      responseText = 'You have one booking for '
                      + classDates[0]['Classes']['Name'] + ' on '
                      + speech.tellDate(classDate['FriendlyDateString']) + ' at '
                      + speech.tellTime(classDates[0]['Classes']['FriendlyStartTimeString'])
    } else {
      responseText = 'You have the following bookings this week. ' +
                      classDates.map(classDate => {
                        return ' on ' + speech.tellDate(classDate['FriendlyDateString']) + ' you have '
                                     + classDate['Classes'].map(aClass => {
                                        return aClass['Name'] + ' at ' + speech.tellTime(aClass['FriendlyStartTimeString'])
                                      }).join()
                                        .replace(/,(?=[^,]*$)/, ' and ')
                      }).join()
    }

    console.log(responseText)
    callback(responseText)
  })
}

const handlers = {
    'LaunchRequest': function() {
        this.emit('WhatAreMyBookingsIntent');
    },
    'LoginIntent': function() {
      this.response.speak('Doesn\'t work yet. Sorry...')
      this.emit(':responseReady')
    },
    'WhatAreMyBookingsIntent': function() {
      fetchBooked({
        booked: true
        //date: tomorrow
      }, (responseText) => {
        this.response.speak(responseText)
        this.emit(':responseReady')
      })
    },
    'AMAZON.HelpIntent': function() {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function() {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function() {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
};

exports.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
