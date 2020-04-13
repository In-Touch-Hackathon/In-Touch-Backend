import { Request, Response } from 'express'
import {addCodeToFirebase, getUserPhone, twilio} from '../libraries'
import {randomCode} from "../util";


const register = (req: Request, res: Response) => {
    res.status(200).send({
        success: true,
        message: 'Created User',
    });
}
const self = (req: Request, res: Response) => {
    res.cookie('cookieName', 'test')
    res.status(200).send({
        success: true,
        message: 'Self',
    });
}

const verify = async(req: Request, res: Response) => {
    const { auth } = req

    const phoneNumber = await getUserPhone(auth.uid)
    const code = randomCode()

    await addCodeToFirebase(auth.uid, code)
     
    console.log("calling")
    try {
        let result =  await twilio.calls
        .create({
            twiml: `<Response><Say>Your In Touch verification code is ${[...code].join(' ')}</Say></Response>`,
            to: phoneNumber,
            from: process.env.TWILIO_PHONE
        })
        console.log(result)
        res.status(200).send({ message: 'Call sent successfully' })
    }catch(err){
        console.log(err)
        res.status(500).send({ message: 'An error occurred' })
    }
}

export {self, register, verify}