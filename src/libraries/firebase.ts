import * as firebase from 'firebase-admin'

firebase.initializeApp({
    credential: firebase.credential.applicationDefault()
})

const db = firebase.firestore();

const getSelf =  async(uid: string) => {
    let users = await db.collection('users').get()
    console.log(users)
}

export { firebase, getSelf }
