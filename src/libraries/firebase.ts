import * as firebase from 'firebase-admin'

firebase.initializeApp({
    credential: firebase.credential.applicationDefault(),
    databaseURL: 'https://in-touch-hackathon.firebaseio.com'
})

export { firebase }
