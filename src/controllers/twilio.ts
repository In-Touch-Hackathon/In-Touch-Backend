import { Request, Response } from 'express'
import { firebase } from '../libraries'
//import VoiceResponse from 'twilio/lib/twiml/VoiceResponse'
import { twiml } from 'twilio'
import { v4 as uuidv4 } from 'uuid'
const { VoiceResponse } = twiml
// WIP, doesn't work yet

const welcome = (req: Request, res: Response) => {
    const twiml = new VoiceResponse()
    const gather = twiml.gather({
        action: '/voice/menu',
        numDigits: 1,
        method: 'POST',
    });

    gather.say(
        'Thanks for calling the In Touch Hotline ' +
        'Please press 1 for current status of covid 19 ' +
        'Press 2 to talk to a volunteer'
    );
    res.type('text/xml');
    res.send(twiml.toString());
}



const voice = (req: Request, res: Response) => {
    const twiml = new VoiceResponse()
    const conferenceId = uuidv4()

    twiml.say(
        { 'voice': 'alice' },
        'Welcome to In-Touch. Please wait while we find an available volunteer'
    )

    twiml.dial().conference(
        {
            maxParticipants: 2,
            startConferenceOnEnter: false,
            endConferenceOnExit: true
        },
        conferenceId
    )
    res.type('text/xml');
    res.send(twiml.toString());
}

const menu = (req: Request, res: Response) => {
    const { Digits } = req.body

    const optionActions = {
        '1': covid19Update,
        '2': callVolunteer,
    };

    (optionActions[Digits])? optionActions[Digits](res): returnWelcome(res)
    return
}

const covid19Update = (res: Response) => {
    const twiml = new VoiceResponse();
    twiml.say({'voice': 'alice'}, `covid 19 update`);
    res.type('text/xml');
    res.send(twiml.toString())
}

const callVolunteer = ( res: Response) => {
    const twiml = new VoiceResponse();
    //find volunteer 
    const name = "test"
    const number = "+6421081810236"
    twiml.say({'voice': 'alice'}, `Connecting you to ${name}.`)
    twiml.dial(number)
    res.type('text/xml');
    res.send(twiml.toString())
}

const returnWelcome = (res: Response) => {
    const twiml = new VoiceResponse();
    twiml.say({'voice': 'alice'}, 'Returning to the main menu');
    twiml.redirect('/ivr/welcome');
    res.type('text/xml');
    res.send(twiml.toString())
}

export { welcome, menu, voice }