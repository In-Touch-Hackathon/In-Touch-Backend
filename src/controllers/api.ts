import { Request, Response } from 'express'
import {getUser, twilio} from '../libraries'


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

    const user = await getUser(auth.uid)
    const phoneNumber = user.get('phoneNumber')

    const code = "test " //set code
     
    console.log("calling")
    try {
        let result =  await twilio.calls
        .create({
            twiml: `<Response><Say>Your In Touch verification code is ${code}</Say></Response>`,
            to: phoneNumber,
            from: '+6498867225'
        })
        console.log(result)
        res.status(200).send({ message: 'Call sent successfully' })
    }catch(err){
        console.log(err)
        res.status(500).send({ message: 'An error occurred' })
    }
}

export {self, register, verify}