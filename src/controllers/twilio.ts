import { Request, Response } from 'express'
import { twiml } from 'twilio'
import {speakStatistics, statistics} from "../data";
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
    twiml.say({'voice': 'alice'}, speakStatistics(statistics));
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

export { welcome, menu }