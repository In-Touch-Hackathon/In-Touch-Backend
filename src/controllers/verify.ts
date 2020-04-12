import { Request, Response } from 'express'

export const verify = (req: Request, res: Response) => {
    const {apiToken} = req.params

    // let message = {
    //     body: `Your In-Touch verification code is: ${code}`,
    //     messagingServiceSid: process.env.TWILIO_SMS,
    //     to: to //should be in the format of '+441632960675'
    // }
    // this.client.messages.create(message)
}
