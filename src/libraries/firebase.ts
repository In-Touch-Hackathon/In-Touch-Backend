import * as admin from 'firebase-admin'

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://in-touch-hackathon.firebaseio.com'
})

export { admin as firebase }
