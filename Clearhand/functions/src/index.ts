
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);


exports.simpleDbFunction = functions.database.ref('/machinesinfo/{ppid}')
    .onWrite(async (event, context) => {


        const data1 = event.after.val().split(`_`);
        await admin.firestore().collection('machines').add({
            [`machineId`]: data1[0],
            [`sprayCount`]: data1[1],
            [`sanitizerLevel`]: data1[2],
            [`levelSensor`]: data1[3],
            [`conatinerNo`]: data1[4],
            [`temp_alert`]: data1[5],
            [`timeStamp`]: admin.firestore.FieldValue.serverTimestamp(),
        });
        await admin.firestore().doc(`machinesinfo_update/${data1[0]}`)
            .set({
                [`machineId`]: data1[0],
                [`sprayCount`]: data1[1],
                [`sanitizerLevel`]: data1[2],
                [`levelSensor`]: data1[3],
                [`conatinerNo`]: data1[4],
                [`temp_alert`]: data1[5],
                [`timeStamp`]: admin.firestore.FieldValue.serverTimestamp(),
            }, { merge: true });

        if (data1[5] == '1') {
            await admin.firestore().collection('machinesinfo_update').doc(data1[0]).get().then(function (doc2) {
                
                    //code goes here
                    admin.firestore().collection('configured_machines').where("machineId", "==", data1[0]).get()
                        .then(function (querySnapshot) {
                            querySnapshot.forEach(function (doc) {
                                // console.log(doc.id, " => ", doc.data().user_id);
                                const db = admin.firestore();
                                db.collection('users').doc(doc.data().user_id).get().then(function (doc1) {
                                    if (doc1.exists) {
                                        // console.log("Document data:", doc1.data()!.fcm_token);
                                        const y = doc1.data()!.fcm_token;
                                        // console.log("fcm is", y);
                                        const payload = {
                                            data: {
                                                flag: '2',
                                                id: data1[0],
                                                title: "High Temp Alert message from team CLEARHAND!!",
                                                body: 'Someone with high temp entered in your premise near CLEARHAND kiosk: ' + data1[0],
                                            }
                                        }
                                        admin.messaging().sendToDevice(y, payload).then(function (response) {
                                            console.log("Successfully sent message:", response);
                                        })
                                            .catch(function (error) {
                                                console.log("Error sending message:", error);
                                            });
                                    } else {
                                        // doc.data() will be undefined in this case
                                        console.log("No such document!");
                                    }
                                }).catch(function (error) {
                                    console.log("Error getting documents: ", error);
                                });


                            });
                        })
                        .catch(function (error) {
                            console.log("Error getting documents: ", error);
                        });
                
            }).catch(function (error) {
                console.log("Error getting documents1: ", error);
            });
        }

        if (data1[3] == '1') {
          await admin.firestore().collection('machinesinfo_update').doc(data1[0]).get().then(function (doc2) {
              if (doc2.data()!.passvalue == 0) {
                  //code goes here
                  admin.firestore().collection('configured_machines').where("machineId", "==", data1[0]).get()
                      .then(function (querySnapshot) {
                          querySnapshot.forEach(function (doc) {
                              // console.log(doc.id, " => ", doc.data().user_id);
                              const db = admin.firestore();
                              db.collection('users').doc(doc.data().user_id).get().then(function (doc1) {
                                  if (doc1.exists) {
                                   // console.log("Document data:", doc1.data()!.fcm_token);
                                      const y = doc1.data()!.fcm_token;
                                      // console.log("fcm is", y);
                                      const payload = {
                                          data: {
                                              flag: '1',
                                              id: data1[0],
                                              title: "Alert message from team CLEARHAND!!",
                                              body: 'Sanitizer Level of CLEARHAND Kiosk : '+ data1[0] + ' is below 20 percent, purchase the 20 liter sanitizer container for refilling from www.clearhand.co.in'
                                          }
                                      }
                                      admin.messaging().sendToDevice(y, payload).then(function (response) {
                                          console.log("Successfully sent message:", response);
                                      })
                                          .catch(function (error) {
                                              console.log("Error sending message:", error);
                                          });
                                  } else {
                                      // doc.data() will be undefined in this case
                                      console.log("No such document!");
                                  }
                              }).catch(function (error) {
                                  console.log("Error getting documents: ", error);
                              });


                          });
                      })
                      .catch(function (error) {
                          console.log("Error getting documents: ", error);
                      });

                   admin.firestore().doc(`machinesinfo_update/${data1[0]}`)
                      .set({
                          ['passvalue']: 1,
                      }, { merge: true })
                      .catch(function (error) {
                          console.log("Error getting documents: ", error);
                      });
              }
            }).catch(function (error) {
                console.log("Error getting documents1: ", error);
              });
           
          
        
            //console.log("needed user:", lis);
        }  








        if (data1[2] == '5' || data1[2] == '4' || data1[2] == '3' || data1[2] == '2' ) {
           
            await admin.firestore().collection('machinesinfo_update').doc(data1[0]).get().then(function (doc2) {
                if (doc2.data()!.passvalue == 1) {
                    //code goes here
                    admin.firestore().collection('configured_machines').where("machineId", "==", data1[0]).get()
                        .then(function (querySnapshot) {
                            querySnapshot.forEach(function (doc) {
                                // console.log(doc.id, " => ", doc.data().user_id);
                                const db = admin.firestore();
                                db.collection('users').doc(doc.data().user_id).get().then(function (doc1) {
                                    if (doc1.exists) {
                                       // console.log("Document data:", doc1.data()!.fcm_token);
                                        const y = doc1.data()!.fcm_token;
                                        // console.log("fcm is", y);
                                        const payload = {
                                            data: {
                                                flag: '1',
                                                id: data1[0],
                                                title: "Alert message from team CLEARHAND!!",
                                                body: 'Sanitizer Level of CLEARHAND Kiosk : ' + data1[0] + ' is below 5 percent, replace the empty sanitizer container. Visit www.clearhand.co.in '
                                            }
                                        }
                                        admin.messaging().sendToDevice(y, payload).then(function (response) {
                                            console.log("Successfully sent message:", response);
                                        })
                                            .catch(function (error) {
                                                console.log("Error sending message:", error);
                                            });
                                    } else {
                                        // doc.data() will be undefined in this case
                                        console.log("No such document!");
                                    }
                                }).catch(function (error) {
                                    console.log("Error getting documents: ", error);
                                });


                            });
                        })
                        .catch(function (error) {
                            console.log("Error getting documents: ", error);
                        });

                    admin.firestore().doc(`machinesinfo_update/${data1[0]}`)
                        .set({
                            ['passvalue']: 2,
                        }, { merge: true })
                        .catch(function (error) {
                            console.log("Error getting documents: ", error);
                        });
                }
            }).catch(function (error) {
                console.log("Error getting documents1: ", error);
            });





        }
        if (data1[2] == '100' || data1[2] == '95' || data1[2] == '90' || data1[2] == '80' || data1[2] == '50' || data1[2] == '30' ) {
            await admin.firestore().doc(`machinesinfo_update/${data1[0]}`)
                .set({
                    ['passvalue'] : 0
                }, { merge: true });
       }

    })
