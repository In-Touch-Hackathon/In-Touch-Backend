import * as firebase from 'firebase-admin'

firebase.initializeApp({
    credential: firebase.credential.applicationDefault()
})

const db = firebase.firestore();

const modifyUser = async (uid: string, user: any) => 
    db.doc(`users/${uid}`).set(user)

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

const verifyCode = async (uid: string, code: string) => {
    const doc = await db.doc(`users/${uid}`).get()
    if (!doc.exists) {
        throw new Error('User does not exist')
    }
    console.log(doc.data())
    if (code !== doc.data().code) {
        throw new Error('Code does not match')
    }
}

export { firebase, addCodeToFirebase, getUser, getUserPhone, modifyUser, verifyCode }