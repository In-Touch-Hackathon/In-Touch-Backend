import * as admin from 'firebase-admin'

const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH)

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://in-touch-hackathon.firebaseio.com'
})

const verify_firebase_token = async(idToken: string): Promise<string> => {
    // idToken comes from the client app
    let decodedToken = await admin.auth().verifyIdToken(idToken)
    let uid = decodedToken.uid
    return uid
}

export { admin as firebase, verify_firebase_token }
