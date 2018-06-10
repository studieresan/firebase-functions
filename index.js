const functions = require('firebase-functions');
const admin = require('firebase-admin')

admin.initializeApp()

exports.incrementPeopleCount = functions.firestore
  .document('activities/{activityId}/people/{registrationId}')
  .onCreate((snap, context) => {
    const activityId = context.params.activityId
    const activity = admin.firestore().collection('activities').doc(activityId)

    return activity.get().then(snap => {
      // get the total count and add 1
      const peopleCount = (snap.data().peopleCount || 0) + 1
      const data = { peopleCount }
      // run update
      return activity.update(data)
    })
  })

exports.decrementPeopleCount = functions.firestore
  .document('activities/{activityId}/people/{registrationId}')
  .onDelete((snap, context) => {
    const activityId = context.params.activityId
    const activity = admin.firestore().collection('activities').doc(activityId)

    return activity.get().then(snap => {
      // get the total count and remove 1
      const peopleCount = Math.max((snap.data().peopleCount || 1) - 1, 0)
      const data = { peopleCount }
      // run update
      return activity.update(data)
    })
  })
