import * as twilio from 'twilio'

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_SECRET;

const client = twilio(accountSid, authToken)

const sms_verify = (to: string, code: string) => {
    let message = {
        body: `Your In-Touch verification code is: ${code}`,
        messagingServiceSid: process.env.TWILIO_SMS,
        to: to //should be in the format of '+441632960675'
    }
    this.client.messages.create(message)
}

export {client as twilio, sms_verify}
