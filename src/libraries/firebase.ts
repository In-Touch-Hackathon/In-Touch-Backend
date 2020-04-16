import * as firebase from 'firebase-admin'

firebase.initializeApp({
    credential: firebase.credential.applicationDefault()
})

const db = firebase.firestore();
const fcm = firebase.messaging();

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
    const doc = await db.doc(`codes/${uid}`).get()
    if (!doc.exists) {
        throw new Error('User does not exist')
    }
    console.log(doc.data())
    if (code !== doc.data().code) {
        throw new Error('Code does not match')
    }
    await db.doc(`users/${uid}`).set({verifed: true}, { merge: true })
}

const sendNotification = async (id: string) => {
    const tokens = await db.collection('/fcmtokens').get()
    const array = tokens.docs.map(doc => doc.id);

    await fcm.sendMulticast({
        notification: {
            body: 'testing'
        },
        android: {
            ttl: 0,
            priority: 'high',
            notification: {
                priority: 'max',
                channelId: 'IncomingCalls'
            }
        },
        data: {
            id,
            click_action: 'FLUTTER_NOTIFICATION_CLICK'
        },
        tokens: array
    })

}

export { firebase, addCodeToFirebase, getUser, getUserPhone, modifyUser, sendNotification, verifyCode }