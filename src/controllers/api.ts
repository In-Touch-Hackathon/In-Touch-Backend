import { Request, Response } from 'express'
import { twilio } from '../libraries'


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
    const { number } = req.params

    const code = "test " //set code
     
    console.log("calling")
    try {
        let result =  await twilio.calls
        .create({
            twiml: `<Response><Say>Your In Touch verification code is ${code}</Say></Response>`,
            to: '+642108180236',
            from: '+6498867225'
        })
        .then(call => console.log(call.sid));
        console.log(result)
    }catch(err){
        console.log(err)
    }
}

export {self, register, verify}