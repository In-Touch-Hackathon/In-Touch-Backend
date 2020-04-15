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

interface AvailableUser {
    uuid: string
    phone_number: string
}

const getAvailableUser = async(): Promise<AvailableUser> => {
    let ids = []
    let toRemove = [] // We'll remove any users that have become unavailable
    let now = firebase.firestore.Timestamp.now().seconds
    let available = db.collection('available');
    (await available.get()).forEach((documentSnapshot) => {
        if (documentSnapshot.exists) {
            let interval = documentSnapshot.data()
            let start = interval.startTime.seconds
            let end = interval.endTime.seconds
            let id = documentSnapshot.id
            if ((now > start) && (now < end)) {
                if (!interval.inCall) {
                    ids.push(id)
                }
            } else if (now >= end) {
                // They are no longer available and thus should be removed
                toRemove.push(id)
            }
        }
    })

    // We only need one available user, so we'll take the first one
    let available_user = null
    let users = db.collection('users')
    for (let id of ids) {
        let user = await users.doc(id).get()
        if (user.exists) {
            let phoneNumber = user.data().phoneNumber
            available_user = { id, phoneNumber }
            // toRemove.push(id) // We shouldn't delete the selected user from available
            await available.doc(id).set({ inCall: true }, { merge: true })
            break
        } else {
            // The user doesn't exist thus needs to be removed from the available collection
            toRemove.push(id)
        }
    }

    // Remove all unavailable users
    for (let id of toRemove) {
        available.doc(id).delete().then(()=>{})
    }

    return available_user;
}

export { AvailableUser, firebase, addCodeToFirebase, getAvailableUser, getUser, getUserPhone, modifyUser, verifyCode }