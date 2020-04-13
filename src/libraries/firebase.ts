import * as firebase from 'firebase-admin'

firebase.initializeApp({
    credential: firebase.credential.applicationDefault()
})

const db = firebase.firestore();

const getUser = async (uid: string) =>
    db.doc(`users/${uid}`).get()

const getUserPhone = async (uid: string) =>
    getUser(uid).then(doc => doc.get('phoneNumber'))

const addCodeToFirebase = async (uid: string, code: string) => {
    const doc = db.doc(`codes/${uid}`)
    await doc.set({ code })

    return setTimeout(async doc => {
        console.log('deleting')
        await doc.delete()
    }, 5*60*1000, doc)
}

export { addCodeToFirebase, firebase, getUser, getUserPhone }
