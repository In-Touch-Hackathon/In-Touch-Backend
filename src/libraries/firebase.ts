import * as firebase from 'firebase-admin'

firebase.initializeApp({
    credential: firebase.credential.applicationDefault()
})

const db = firebase.firestore();

const getUser = async (uid: string) =>
    db.doc(`users/${uid}`).get()

const getUserPhone = async (uid: string) =>
    getUser(uid).then(doc => doc.get('phoneNumber'))

export { firebase, getUser, getUserPhone }
