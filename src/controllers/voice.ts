import { Request, Response } from 'express'
import { firebase } from '../libraries'
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse'
import { v4 as uuidv4 } from 'uuid'

// WIP, doesn't work yet

export const voice = (req: Request, res: Response) => {
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
