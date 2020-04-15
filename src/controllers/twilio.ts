import { Request, Response } from 'express'
import { twiml } from 'twilio'
import {speakStatistics, statistics} from "../data";
const { VoiceResponse } = twiml
// WIP, doesn't work yet

const welcome = (req: Request, res: Response) => {
    console.log(req)
    const twiml = new VoiceResponse()
    const gather = twiml.gather({
        action: '/ivr/menu',
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

const menu = (req: Request, res: Response) => {
    const { Digits } = req.body

    const optionActions = {
        '1': covid19Update,
        '2': callVolunteer,
    };

    var twimlResponse = (optionActions[Digits])? optionActions[Digits](): returnWelcome()
    res.type('text/xml')
    return res.send(twimlResponse)
}

const covid19Update = () => {
    const twiml = new VoiceResponse()
    twiml.say({'voice': 'alice'}, speakStatistics(statistics));
    return twiml.toString()
}

const callVolunteer = () => {
    const twiml = new VoiceResponse()
    //find volunteer 
    const name = "test"
    const number = "+6421081810236"
    twiml.say({'voice': 'alice'}, `Connecting you to ${name}.`)
    twiml.dial(number)
    return twiml.toString()
}

const returnWelcome = () => {
    const twiml = new VoiceResponse()
    twiml.say({'voice': 'alice'}, 'Returning to the main menu')
    twiml.redirect('/ivr/welcome')
    return twiml.toString()
}

export { welcome, menu }