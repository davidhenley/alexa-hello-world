exports.handler = function(event, context) {
  const request = event.request;

  // request.type
  /*
    LaunchRequest
    IntentRequest
    SessionEndedRequest
  */
  try {
    if (request.type === 'LaunchRequest') {
      return context.succeed(buildResponse({
        speechText: 'Welcome to Greetings skill. Using our skill you can greet your guests. Whom do you want to greet?',
        repromptText: 'You can say for example, say hello to John.',
        endSession: false
      }));
    } else if (request.type === 'IntentRequest') {
      if (request.intent.name === 'HelloIntent') {
        let name = request.intent.slots.FirstName.value;
        return context.succeed(buildResponse({
          speechText: `Hello ${name}. ${getGreeting()}`,
          endSession: true
        }));
      } else {
        throw 'Unknown intent';
      }
    } else if (request.type === 'SessionEndedRequest') {

    } else {
      throw 'Unknown intent type';
    }
  } catch (e) {
    return context.fail('Exception:', e);
  }
}

function buildResponse(options) {
  const response = {
    version: '1.0',
    response: {
      outputSpeech: {
        type: 'PlainText',
        text: options.speechText
      },
      shouldEndSession: options.endSession
    }
  };

  if (options.repromptText) {
    response.response.reprompt = {
      outputSpeech: {
        type: 'PlainText',
        text: options.repromptText
      }
    };
  }

  return response;
}

function getGreeting() {
  const date = new Date();
  let hours = date.getUTCHours() - 7;
  if (hours < 0) {
    hours = hours + 24;
  }
  if (hours < 12) {
    return 'Good morning.';
  } else if (hours < 18) {
    return 'Good afternoon.';
  } else {
    return 'Good evening';
  }
}