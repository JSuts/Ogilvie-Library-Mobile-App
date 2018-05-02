import firebase from 'react-native-firebase';
import md5 from 'md5';

module.exports = {
  signIn: (username, password) => {
    return new Promise((resolve, reject) => {
      username = username.trim()
      username = username.toLowerCase();
      if (username != "") {
        if (password != "") {
          let userRef = firebase.firestore().collection('users');
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
  signUp: (fName, lName, email, username, password) => {
    return new Promise((resolve, reject) => {
      fName = fName.trim()
      lName = lName.trim()
      email = email.trim().toLowerCase()
      username = username.trim()
      let userRef = firebase.firestore().collection('users');
      userRef.get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          let dbEmail = doc.data().email.toLowerCase();
          if (email == dbEmail) {
            reject("Email already registered. Please Sign In instead.")
          } else {
            let dbUsername = doc.data().username.toLowerCase()
            if (username.toLowerCase() == dbUsername) {
              reject("Username unavailable. Please choose another.")
            }
          }
        })
        resolve("Found no matches, should be good to register")
      })
      .catch((err) => {
        reject("Server Error: " + err)
      })
    })
  },
}
