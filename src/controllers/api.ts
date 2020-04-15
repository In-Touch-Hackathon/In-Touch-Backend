import { Request, Response } from 'express'
import { addCodeToFirebase, getUserPhone, twilio, verifyCode } from '../libraries'
import { randomCode } from "../util";
import { modifyUser, getUser, firebase } from "../libraries"
import { statistics} from "../data";


const register = async (req: Request, res: Response) => {
    try {
        const { auth, body } = req
        const { phoneNumber, displayName } = body
        const user = {
            phoneNumber: phoneNumber,
            displayName: displayName,
            verified: false,
            lastModifed: firebase.firestore.FieldValue.serverTimestamp()
        }
        await modifyUser(auth.uid, user)
        res.status(200).send({ message: 'Created User' });
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'An error occurred' })
    }
}

const self = async (req: Request, res: Response) => {
    try {
        res.status(200).send(await getUser(req.auth.uid));
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'An error occurred' })
    }
}

const verify = async (req: Request, res: Response) => {
    const { auth } = req

    const phoneNumber = await getUserPhone(auth.uid)
    const code = randomCode()

    await addCodeToFirebase(auth.uid, code)

    console.log("calling")
    try {
        let result =  await twilio.calls
        .create({
            twiml: `<Response><Say>Your In Touch verification code is ${[...code].join('. ')}</Say></Response>`,
            to: phoneNumber,
            from: process.env.TWILIO_PHONE
        })
        console.log(result)
        res.status(200).send({ message: 'Call sent successfully' })
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'An error occurred' })
    }
}

const codeVerify = async (req: Request, res: Response) => {
    const { auth, body } = req
    try {
        await verifyCode(auth.uid, body.code)
        res.status(200).send({ message: 'Phone Number has been verified' });
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'An error occurred' })
    }
}

const covid19 = async  (req: Request, res: Response) => {
    res.status(200).send(statistics)
}

export { self, register, verify, covid19 }