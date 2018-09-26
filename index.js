/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

'use strict';

const Alexa = require('alexa-sdk');
const classes = require('./classes');

const APP_ID = 'amzn1.ask.skill.01b29b73-41cc-4ac0-8563-b6d5c82753e1';

const SKILL_NAME = 'Fitness First';
const HELP_MESSAGE = 'You can ask me to make a new booking, view your bookings or cancel them. Keep it up, you cheeky bastard!';
const HELP_REPROMPT = 'Sorry mate, do you need a spot?';
const STOP_MESSAGE = 'See you after the work out!';

const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate()+1)
tomorrow.setHours(0,0,0,0)

const fetch = (criteria, callback) => {
  classes.fetch(criteria, (classDate) => {
    const classes = classDate['Classes']

    let responseText;

    if(!classes || classes.length === 0){
      responseText = 'There are no spin classes for this date'
    } else if(classes.length === 1){
      responseText = 'There is a spin class on ' + classDate['FriendlyDateString'] + ' at ' + classes[0]['FriendlyStartTimeString']
    } else {
      responseText = 'There are ' + classes.length + ' spin classes on ' + classDate['FriendlyDateString'] + ', at ' +
                      classes.map((aClass) => aClass['FriendlyStartTimeString'])
                             .join()
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
      fetch({
        club: 'BRIGH', //TODO
        class: 'spin', //TODO
        date: tomorrow
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
