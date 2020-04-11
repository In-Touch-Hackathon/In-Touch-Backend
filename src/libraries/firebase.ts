import * as admin from 'firebase-admin'
import { volunteer } from '../models/firebase'

const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH)

const db = admin.database()


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://in-touch-hackathon.firebaseio.com'
})

const verify_firebase_token = async (idToken: string): Promise<string> => {
    // idToken comes from the client app
    let decodedToken = await admin.auth().verifyIdToken(idToken)
    let uid = decodedToken.uid
    return uid
}

const register_user = (user: volunteer) => {
    let ref = db.ref("volunteer")
    ref.set({

    })
}

export {admin as firebase, verify_firebase_token, register_user}
