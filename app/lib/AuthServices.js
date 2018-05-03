import firebase from 'react-native-firebase';
import md5 from 'md5';

let db = firebase.firestore();
let settings = db.settings;
settings.areTimestampsInSnapshotsEnabled = true;
db.settings = settings;

module.exports = {
  signIn: (username, password) => {
    return new Promise((resolve, reject) => {
      username = username.trim()
      username = username.toLowerCase();
      if (username != "") {
        if (password != "") {
          let userRef = db.collection('users');
          userRef.get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {

              let dbUsername = doc.data().username.toLowerCase();
              if (username == dbUsername) {
                let dbPassword = doc.data().password;
                if (md5(password) == dbPassword) {
                  let response = {
                    docId: doc.id,
                    userData: doc.data()
                  }
                  resolve(response)
                } else {
                  reject("Password does not match")
                }
              }
            })
            reject("No matching accounts")
          })
          .catch((err) => {
            console.log("dbg: err: " + err);
            reject(err)
          })
        } else {
          reject("No password Entered")
        }
      } else {
        reject("No username Entered")
      }
    })
  },
  signUp: (fName, lName, email, username, password, staffKey) => {
    return new Promise((resolve, reject) => {
      fName = fName.trim();
      lName = lName.trim();
      email = email.trim().toLowerCase();
      username = username.trim();
      password = md5(password);
      let userRef = db.collection('users');
      userRef.get()
      .then((snapshot) => {
        var validData = true;
        snapshot.forEach((doc) => {
          let dbEmail = doc.data().email.toLowerCase();
          if (email == dbEmail) {
            validData = false;
            reject("Email already registered. Please Sign In instead.")
          } else {
            let dbUsername = doc.data().username.toLowerCase()
            if (username.toLowerCase() == dbUsername) {
              validData = false;
              reject("Username unavailable. Please choose another.")
            }
          }
        })
        if (validData) {
          let userData = {
            fName: fName,
            lName: lName,
            email: email,
            username: username,
            password: password,
            fees: 0
          }
          if (staffKey == 'yesiamstaff') {
            userData.role = "staff"
          } else {
            userData.role = "student"
          }

          userRef.add(userData)
          .then((docRef) => {
            docRef.get()
            .then((doc) => {
              let response = {
                docId: doc.id,
                userData: doc.data()
              }
              resolve(response)
            })
            .catch((err) => {
              reject("docRef bad: " + err)
            })
          })
          .catch((err) => {
            reject("Unable to add user to database: " + err)
          })
        }
      })
      .catch((err) => {
        reject("Server Error: " + err)
      })
    })
  },
}
