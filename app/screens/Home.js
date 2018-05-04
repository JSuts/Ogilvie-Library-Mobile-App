import React from "react";
import { AsyncStorage, StatusBar, View, Alert } from "react-native";
import { List, ListItem, Container, Header, Title, Thumbnail, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem, Spinner } from "native-base";
import { Col, Row, Grid } from "react-native-easy-grid";

import firebase from 'react-native-firebase';

let db = firebase.firestore();
let settings = db.settings;
settings.areTimestampsInSnapshotsEnabled = true;
db.settings = settings;

export default class Home extends React.Component {
  constructor() {
    super();
    this.vm = this;
    this.userRef = db.collection('users');
    this.bookRef = db.collection('books');
    this.arRef = db.collection('activeRentals');
    this.prRef = db.collection('previousRentals');


    this.state = {
      userId: "",
      name: "",
      fees: 0,
      doneLoading: false,
      userData: "",
      books: [],
      lateBooks: [],
      reservations: []
    }

    /* fcmToken update listener */
    this.onTokenRefreshListener = firebase.messaging().onTokenRefresh((fcmToken: string) => {
      // new token received
      if (this.state.userId != "") {
        this._updateToken(fcmToken);
      }
    });

    /* When a notification is received but not displayed */
    this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
      firebase.notifications().displayNotification(notification);
    });
    let getKeys = [
      'userId',
      'fName',
      'lName'
    ]
    AsyncStorage.multiGet(getKeys)
    .then((values) => {
      let fullName;
      values.map((result, i, store) => {
      // get at each store's key/value so you can work with it
      let key = store[i][0];
      let value = store[i][1];
      switch (key) {
        case "userId":
          this.setState({
            userId: value
          })
          break;
        case "fName":
          fullName = value;
          break;
        case "lName":
          fullName += " " + value;
          this.setState({
            name: fullName
          })
          break;
      }
    });
    firebase.messaging().getToken()
      .then(fcmToken => {
        if (fcmToken) {
          // token found
          this._updateToken(fcmToken);
        }
      });
      this._getFireInfo();
      this._getFireRentals();
    })
  }

  componentWillUnmount() {
    this.onTokenRefreshListener();
    this.notificationListener();
  }

  _updateToken(token) {
    /* check notification permissions */
    firebase.messaging().hasPermission()
      .then(enabled => {
        if (this.state.userId != "") {
        if (enabled) {
          /* notifications enabled */
          this.userRef.doc(this.state.userId).set({ fcmToken: token, getNotifications: true }, { merge: true })
        } else {
          /* request notification permissions */
          firebase.messaging().requestPermission()
          .then(() => {
            /* accepted permissions */
            this.userRef.doc(this.state.userId).set({ fcmToken: token, getNotifications: true }, { merge: true })
          })
          .catch(error => {
            /* rejected permissions */
            this.userRef.doc(this.state.userId).set({ fcmToken: token, getNotifications: false }, { merge: true })
          });
        }}
      })
  }

  _getFireInfo() {
    this.userRef.doc(this.state.userId).get()
    .then((doc) => {
      let data = doc.data();
      this.setState({
        fees: data.fees
      })
    })
  }


  /* get count of how many elements are in the snapshot and when they are done, set done loading to true */

  _getFireRentals() {
    let booksArray = []
    this.arRef.get()
    .then((snapshot) => {
      if (snapshot.empty) {
        this.setState({ doneLoading: true })
      }
      else {
        let count = 0;
        snapshot.forEach((rentalDoc) => {
          let rentalData = rentalDoc.data();
          let dbUserRef = rentalData.userId;
          let stateUserRef = this.userRef.doc(this.state.userId)
          if (JSON.stringify(dbUserRef._documentPath) == JSON.stringify(stateUserRef._documentPath)) {
            rentalData.bookId.get()
            .then((bookDoc) => {
              let bookData = bookDoc.data();
              if (bookData.bookTitle.includes(", The")) {
                bookData.bookTitle = "The " + bookData.bookTitle.substr(0, (bookData.bookTitle.length - 5))
              }
              let dueDate = rentalData.dueDate;
              let curTime = new Date();

              let dueDateString = dueDate.toString()

              let dif = (dueDate - curTime)
              dif = dif / 86400000
              if (dif < 0 && dif > -1) {
                dif = -1
              } else {
                dif = parseInt(dif)
              }

              bookData.dueDate = {
                days: dif,
                date: dueDateString.substring(0, dueDateString.lastIndexOf(":"))
              }
              bookData.rentalId = rentalDoc.id;
              bookData.bookId = rentalData.bookId.id;

              booksArray.push(bookData)
              this.setState({ books: booksArray });
            })
          }
          if (count == (snapshot.size - 1)) {
            setTimeout(() => this.setState({ doneLoading: true })
            , 350);
          }
          count++;
        })
      }
    })
  }

  // _getInfo() {
  //   let request = new XMLHttpRequest();
  //
  //   request.onreadystatechange = (e) => {
  //     if (request.readyState == 4) {
  //       if (request.status == 200) {
  //         let data = JSON.parse(request.responseText);
  //
  //         this._getBooks(data)
  //
  //         this.setState({
  //           userData: data
  //         })
  //       } else {
  //         console.log(request.status);
  //         console.warn('fetching books failure :\\');
  //       }
  //     }
  //   }
  //
  //   let url = "http://jake.westmec-coding.org/api/userInformation/"
  //   url += store.getState().loggedInUser
  //   request.open('GET', url)
  //   request.send();
  // }
  //
  //
  // _getBooks(books) {
  //
  //     let request = new XMLHttpRequest();
  //
  //     request.onreadystatechange = (e) => {
  //       if (request.readyState == 4) {
  //         if (request.status == 200) {
  //           let data = JSON.parse(request.responseText);
  //
  //           this._getLateBooks(data, books.books)
  //           this._getReservations(data, books.reservations)
  //
  //           this.setState({
  //             books: data
  //           })
  //         } else {
  //           console.log(request.status);
  //           console.warn('fetching books failure :\\');
  //         }
  //       }
  //     }
  //
  //
  //     let url = books.books.reduce((accumulator, book, i) => {
  //       if (i == (books.length - 1)) {
  //         return accumulator + book.bookID
  //       } else {
  //         return accumulator + book.bookID + "_"
  //       }
  //     }, "http://jake.westmec-coding.org/api/getBooks/")
  //     request.open('GET', url)
  //     request.send();
  // }
  //
  // _getLateBooks(fullBook, dueDateObj) {
  //   let today = new Date()
  //   let lateBooks = dueDateObj.map((ddo, i) => {
  //     let dueDate = new Date(ddo.dueDate)
  //     if (dueDate < today) {
  //       fullBook[i].daysLate = Math.round((today - dueDate) / (1000 * 60 * 60 * 24));
  //       return fullBook[i]
  //     }
  //   })
  //   this.setState({
  //     lateBooks: lateBooks
  //   })
  // }
  //
  //
  // _getReservations(fullBook, info) {
  //   if (info.length == 0) {
  //     this.setState({
  //       doneLoading: true,
  //       reservations: []
  //     })
  //   } else {
  //     let request = new XMLHttpRequest();
  //
  //     request.onreadystatechange = (e) => {
  //       if (request.readyState == 4) {
  //         if (request.status == 200) {
  //           let data = JSON.parse(request.responseText);
  //
  //           this.setState({
  //             doneLoading: true,
  //             reservations: data
  //           })
  //         } else {
  //           console.log(request.status);
  //           console.warn('fetching books failure :\\');
  //         }
  //       }
  //     }
  //
  //
  //     let url = info.reduce((accumulator, reserve, i) => {
  //       if (i == (info.length - 1)) {
  //         return accumulator + reserve.bookID
  //       } else {
  //         return accumulator + reserve.bookID + "_"
  //       }
  //     }, "http://jake.westmec-coding.org/api/getBooks/")
  //     request.open('GET', url)
  //     request.send();
  //   }

    // let reservations = info.reservations.map((info, i) => {
    //
    // })
    // this.setState({
    //   doneLoading: true,
    //   reservations: reservations
    // })
  // }



  render() {
    // var count = 0; 
    return (
      <Container>
        <Header style={{ backgroundColor: '#555555' }}>
        {/* <Header style={{ backgroundColor: '#FFD6A0' }}> */}
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("DrawerOpen")}>
              <Icon name="menu" style={{ color: "rgb(58, 132, 173)" }} />
            </Button>
          </Left>
          <Body>
            <Title style={{color: '#F7F7F2'}}>Home</Title>
          </Body>
          <Right />
        </Header>



        <Content padder style={{backgroundColor: '#261C15', flex: 1}}>
          <Grid style={{flex: 1}}>
            <Row style={{flex:1, alignItems:'flex-end'}}>
              <Col size={3} style={{ alignItems: 'flex-start', }}>
                <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#CC4316' }}>
                  {this.state.name}
                </Text>
              </Col>
              <Col size={3}>
                <Text style={{ fontSize: 19, alignSelf: 'flex-end', alignItems: 'flex-end', justifyContent: 'flex-end', color: '#F7F7F2' }}>
                  Current Fees: ${this.state.fees}
                </Text>
              </Col>
              <Col size={1}>
                <Button
                  small
                  transparent
                  style={{alignSelf: 'flex-end'}}
                  onPress={() => {
                    alert("Pay any outstanding fees at the student bookstore.")
                  }}
                  >
                  <Icon type="SimpleLineIcons" name="question" style={{fontSize: 17}} />
                </Button>
              </Col>
            </Row>
          </Grid>
          <Grid style={{flex: 1, justifyContent: 'center', alignSelf: 'center', alignItems: 'center'}}>


            {this.state.doneLoading ? <BookList books={this.state.books} doneLoading={this.state.doneLoading} navigation={this.props.navigation} vm={this.vm} /> : null}
            {this.state.doneLoading ? null : <Spinner color='#CC4316' />}

          </Grid>

      </Content>
        {/* {
          "lName":"Smith",
          "fName":"John",
          "username":"JSmith",
          "email":"jsmith@mail.com",
          "role":"student",
          "fees":0,
          "fcmToken":"cLjJmXD2bDU:APA91bEw9yFdFjX0jmWTY2HJgxaY61-Phu2ci8oVq4K59reyFnD_Lp4yTXDr6ldFg5QvgDI5VtTL8MlnEiG3CL1veoc5QJ5OtEedyQxghnHXXncmgumkp6HUu8H5cUlCSbgNxvGm-LpI",
          "password":"1a1dc91c907325c69271ddf0c944bc72",
          "getNotifications":true} */}

          {/* {this.state.doneLoading == false ? <Spinner color='blue' /> : <RenderHomePage navigation={this.props.navigation} userData={this.state.userData} books={this.state.books} lateBooks={this.state.lateBooks} reservations={this.state.reservations} />} */}

      </Container>
    );
  }
}

const BookList = (props) => {
  if (props.books.length > 0) {
    return (
      <List
        style={{ flex: 1}}
        dataArray={props.books}
        renderRow={(item) => {
          if (item != undefined) {
            return(
              <ListItem style={{backgroundColor: '#F7F7F2', paddingLeft: 5, marginVertical: 10, flex: 1 }}>
                <Grid>
                  <Col size={1}>
                    <Thumbnail large square style={{ height: 100, resizeMode: 'contain'}} source={{ uri: item.coverURL }} defaultSource={require('../../assets/Book_Placeholder.png')}/>
                  </Col>
                  <Col size={3}>
                    <Row size={1}>
                      <Col style={{ flex: 1 }}>
                        <Text style={item.dueDate.days > 0 ? {alignSelf: 'flex-start', fontSize: 10} : {alignSelf: 'flex-start', color: 'red', fontSize: 10} } >
                          {item.dueDate.days > 0 ? ("Due in " + item.dueDate.days + " day(s) on " + item.dueDate.date) : (Math.abs(item.dueDate.days) + " day(s) overdue!") }
                        </Text>
                      </Col>
                    </Row>
                    <Row size={1}>
                      <Col style={{ flex: 1 }}>
                        <Text style={{alignSelf: 'flex-start', fontWeight: 'bold', fontSize: 15}}>
                          {item.bookTitle}
                        </Text>
                      </Col>
                    </Row>
                    <Row size={2}>
                      <Col style={{flex: 1 }}>
                        <Text style={{ alignSelf: 'flex-start', fontWeight: 'bold', fontSize: 12}}>
                          {item.authorFName + " " + item.authorLName}
                        </Text>
                      </Col>
                    </Row>
                    <Row size={1}>
                      <Col style={{flex: 1, justifyContent: 'flex-start'  }}>
                        <Button small style={{ backgroundColor: '#1DA1F2', alignSelf: 'flex-start', borderRadius: 5}}>
                          <Thumbnail square small style={{resizeMode: 'contain', borderRadius: 5}} source={require('../../assets/Twitter_Logo_WhiteOnBlue.png')} />
                        </Button>
                      </Col>
                      <Col style={{flex: 1, justifyContent: 'flex-end'  }}>
                        <Button
                          small
                          style={{ backgroundColor: '#197278', alignSelf: 'flex-end'}}
                          onPress={() => {
                            Alert.alert(
                              'Alert',
                              'Are you sure you want to return ' + item.bookTitle + '?',
                              [
                                {text: 'Return', onPress: () => {
                                  props.vm.arRef.doc(item.rentalId).get()
                                  .then((rentalDoc) => {
                                    rentalData = rentalDoc.data()
                                    rentalData.returnDate = new Date();

                                    props.vm.prRef.add(rentalData)
                                    .then((ref) => {
                                      // NOTE: Deletes the document from activeRentals Collection
                                      props.vm.arRef.doc(item.rentalId).delete()
                                      .then((response) => {
                                        props.vm.bookRef.doc(item.bookId).update({
                                          Available: true
                                        })
                                        .catch((err) => {
                                          alert("Couldn't update book to be available. Error: " + err)
                                        });
                                        props.navigation.navigate("AuthLoading")
                                      })
                                      .catch((err) => {
                                        alert("Couldn't delete rental from ar. Error: " + err)
                                      });
                                    })
                                    .catch((err) => {
                                      alert("There was a problem adding the rental to the previousRental Collection. Error: " + err);
                                    });
                                  })
                                  .catch((err) => {
                                    alert("There was a problem returning your book. Error: " + err)
                                  });
                                }},
                                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                              ]
                            )

                            // bookRef is actually the book reference. Can be used with .get()
                          }}
                        >
                          <Text style={{ fontWeight: 'bold', fontSize: 15}}>
                            Return book
                          </Text>
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Grid>
              </ListItem>
            )
          } else {
            alert("item == undefined")
          }
        }}
      />
    )
  } else {
    return (
      <Grid>
        <Row>
          <Col>
            <Button
              block
              style={{ marginTop: 20, backgroundColor: '#197278' }}
              onPress={() => {
                props.navigation.navigate("Catalog")
              }}
              >
                <Text>
                  Visit the Catalog
                </Text>
              </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              block
              style={{ marginTop: 20, backgroundColor: '#197278', }}
              onPress={() => {
                props.navigation.navigate("Map")
              }}
              >
                <Text>
                  View the Map
                </Text>
              </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              block
              style={{ marginTop: 20, backgroundColor: '#197278'}}
              onPress={() => {
                props.navigation.navigate("FAQ")
              }}
            >
              <Text>
                Frequently Asked Questions
              </Text>
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              block
              style={{ marginTop: 20, backgroundColor: '#197278'}}
              onPress={() => {
                props.navigation.navigate("Settings")
              }}
            >
              <Text>
                Settings
              </Text>
            </Button>
          </Col>
        </Row>
      </Grid>
    )
  }
}

// class BookList extends React.Component {
//   render() {
//     return(
//       <List
//         dataArray={this.props.books}
//         renderRow={(item) => {
//           if (item != undefined) {
//             return(
//               <ListItem>
//                 <Text>
//                   {item.bookTitle}
//                 </Text>
//               </ListItem>
//             )
//           } else {
//             return(null)
//           }
//         }}
//       />
//     )
//   }
// }
//
//
// class VisitList extends React.Component {
//   render() {
//     return (
//       <List>
//         <ListItem onPress={() => {
//           this.props.navigation.navigate("Browse");
//         }}>
//           <Text> Visit Our Catalog </Text>
//         </ListItem>
//       </List>
//     )
//   }
// }
//
//
// class LateList extends React.Component {
//   render() {
//     return(
//       <List
//         dataArray={this.props.books}
//         renderRow={(item) => {
//           if (item != undefined) {
//             return(
//               <ListItem>
//                 <Grid>
//                   <Row>
//                     <Text>
//                       {item.bookTitle}
//                     </Text>
//                   </Row>
//                   <Row>
//                     <Text>
//                       Day's Late: {item.daysLate}
//                     </Text>
//                   </Row>
//               </Grid>
//               </ListItem>
//             )
//           } else {
//             return(null)
//           }
//         }}
//       />
//     )
//   }
// }
//
// class RenderHomePage extends React.Component {
//   render() {
//     return (
//       <Grid style={{ backgroundColor: 'skyblue' }}>
//         <Row size={12} style={{ marginTop: 20, marginHorizontal: 10, borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
//           <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
//
//             Welcome, {this.props.userData.name}!
//           </Text>
//         </Row>
//           <Row size={28} style={{}}>
//             <Content style={{ flex: 1, marginVertical: 25, marginHorizontal: 10, padding: 5, borderWidth: 3, borderColor: 'black', borderRadius: 5, backgroundColor: 'white'}}>
//               <Text>
//                 Books Checked Out: {this.props.userData.books.length}
//               </Text>
//               {this.props.userData.books.length == 0 ? <VisitList navigation={this.props.navigation} /> : <BookList books={this.props.books} />}
//             </Content>
//           </Row>
//           <Row size={20} style={{ }}>
//             <Content style={{ flex: 1, marginVertical: 10, marginHorizontal: 10, padding: 5, borderWidth: 3, borderColor: 'black', borderRadius: 5, backgroundColor: 'white'}}>
//               <Text>
//                 Late Books
//               </Text>
//               {this.props.lateBooks.length == 0 ? <Text>Good Job!</Text> : <LateList books={this.props.lateBooks} />}
//             </Content>
//           </Row>
//           <Row size={20} style={{ }}>
//             <Content style={{ flex: 1, marginVertical: 10, marginHorizontal: 10, padding: 5, borderWidth: 3, borderColor: 'black', borderRadius: 5, backgroundColor: 'white'}}>
//               <Text>
//                 Reservations
//               </Text>
//               <BookList books={this.props.reservations} />
//             </Content>
//           </Row>
//           <Row size={20} style={{ }}>
//           </Row>
//       </Grid>
//     )
//   }
// }
