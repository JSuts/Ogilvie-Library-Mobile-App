import React from 'react';
import { StyleSheet, View, Image, FlatList, AsyncStorage } from 'react-native';
import { Root, ActionSheet, Body, Input, Button, Container, Content, Drawer, Footer, FooterTab, Header, Icon, Left, List, ListItem, Right, Text, Title, Thumbnail, Spinner, Form, Item } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
// import { store } from "../../store/store.js"
import firebase from 'react-native-firebase'

let db = firebase.firestore();
let settings = db.settings;
settings.areTimestampsInSnapshotsEnabled = true;
db.settings = settings;




export default class Catalog extends React.Component {
  constructor() {
    super();
    this.vm = this;
    this.curTime = new Date();
    this.userRef = db.collection('users');
    this.bookRef = db.collection('books');
    this.arRef = db.collection('activeRentals');
    this.prRef = db.collection('previousRentals');

    this.state = {
      books: [],
      doneLoading: false,
      filteredBooks: []
    }
    /* When a notification is received but not displayed */
    this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
      firebase.notifications().displayNotification(notification)
    });
    this._getFireBooks()
  }

  _getFireBooks() {
    let booksArray = []
    this.bookRef.get()
    .then((snapshot) => {
      let count = 0;
      snapshot.forEach((bookDoc) => {
        let bookData = bookDoc.data();

        bookData.bookRef = bookDoc;

        booksArray.push(bookData)
        this.setState({ books: booksArray });

        if (booksArray.length > 1) {
          booksArray.sort(function(a, b){
            var keyA = a.bookTitle,
            keyB = b.bookTitle;
            // Compare the 2 dates
            if(keyA < keyB) return -1;
            if(keyA > keyB) return 1;
            return 0;
          });
        }



        if (count == (snapshot.size - 1)) {
            this.setState({ doneLoading: true })
            this._fixBooks();
        }
        count++
      })
    })
  }

  _fixBooks() {
    let booksArray = []
    for (book of this.state.books) {
      if (book.bookTitle.includes(", The")) {
        book.bookTitle = "The " + book.bookTitle.substr(0, (book.bookTitle.length - 5))
      }
      booksArray.push(book)
      this.setState({ books: booksArray })
    }
  }




  // _getBooks() {
  //   let request = new XMLHttpRequest();
  //
  //   request.onreadystatechange = (e) => {
  //     if (request.readyState == 4) {
  //       if (request.status == 200) {
  //         let data = JSON.parse(request.responseText);
  //
  //         this.setState({
  //           books: data
  //         })
  //
  //
  //       } else {
  //         console.log(request.status);
  //         console.warn('fetching books failure :\\');
  //       }
  //     }
  //   }
  //
  //   let url = "http://jake.westmec-coding.org/api/getBooks"
  //   request.open('GET', url)
  //   request.send();
  // }

  render() {
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
              <Icon style={{fontSize: 15}} type="Entypo" name="book" />
              <Title style={{color: '#F7F7F2' }}>Catalog</Title>
            </Body>
            <Right />
          </Header>
        <Content padder style={{backgroundColor: '#261C15', flex: 1}}>
          {this.state.doneLoading ? <Filter books={this.state.books} vm={this.vm} /> : null}
          {this.state.doneLoading && this.state.filteredBooks.length == 0 ? <BookList books={this.state.books} navigation={this.props.navigation} vm={this.vm} /> : null}
          {this.state.filteredBooks.length > 0 ? <BookList books={this.state.filteredBooks} navigation={this.props.navigation} vm={this.vm} /> : null}
          {this.state.doneLoading ? null : <Spinner color='#CC4316' />}
        </Content>
          {/* <Header style={{ backgroundColor: 'lightblue'}}>
            <Left>
              <Button transparent onPress={ () => this.props.navigation.navigate("DrawerOpen")}>
                <Icon name='menu' />
              </Button>
            </Left>
            <Body>
              <Title style={{ fontWeight: 'bold', fontSize: 21}}>Library Books</Title>
            </Body>
            <Right>
              <Button transparent>
                <Icon
                  name='refresh'
                  onPress={() => {
                    this.setState({
                      books: []
                    })
                    this._getBooks()
                  }}
                />
              </Button>
            </Right>
          </Header> */}

        {/*
          <Content style={{backgroundColor: 'skyblue'}}>
            <Grid>
              {/* Info Bar at the top of the Books }
              <Row size={1} style={{backgroundColor: 'white'}}>
                <Col size={1} style={{ flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
                  <Text>Book Cover</Text>
                </Col>
                <Col size={4} style={{ justifyContent: 'flex-end', alignItems: 'center'}}>
                    <Text>Title and Information</Text>
                </Col>
                <Col size={1} style={{ flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                  <Text>Status</Text>
                </Col>
              </Row>

              {/* Books }
              <Row size={8}>
                <DisplayBooks books={this.state.books} />
              </Row>
            </Grid>
          </Content>
          */}
        </Container>
    );
  }
}

const BookList = (props) => {
  return(
    <List
      style={{ flex: 1}}
      dataArray={props.books}
      renderRow={(item) => {
        return(
          <ListItem style={{backgroundColor: '#F7F7F2', paddingLeft: 10, marginVertical: 5, flex: 1, borderRadius: 3 }}>
            <Grid style={{backgroundColor: '#197278', paddingRight: 5, paddingVertical: 10, borderRadius: 3}}>
              <Col size={3}>
                <Thumbnail square large style={{ height: 100,resizeMode: 'contain'}} source={{ uri: item.coverURL }} defaultSource={require('../../assets/Book_Placeholder.png')} />
              </Col>
              <Col size={8} style={{ alignItems: 'center' }}>
                <Row size={1}>
                  <Col style={{ flex: 1 }}>
                    <Text style={{alignSelf: 'flex-start', color: '#F7F7F2', fontWeight: 'bold', fontSize: 15}}>
                      {item.bookTitle}
                    </Text>
                  </Col>
                </Row>
                <Row size={2}>
                  <Col style={{flex: 1 }}>
                    <Text style={{ alignSelf: 'flex-start', color: '#F7F7F2', fontWeight: 'bold', fontSize: 12}}>
                      {item.authorFName + " " + item.authorLName}
                    </Text>
                  </Col>
                </Row>
                <Row size={1}>
                  <Col style={{flex: 1, justifyContent: 'flex-end'  }}>
                    <Button
                      small
                      style={{ backgroundColor: '#F7F7F2', alignSelf: 'flex-end'}}
                      onPress={() => {
                        console.log("dbg: CHECK OUT PLZ");
                        let bookCount = 0;
                        let count = 0;
                        AsyncStorage.getItem('role')
                        .then((role) => {
                          AsyncStorage.getItem('userId')
                            .then((userId) => {

                              props.vm.arRef.get()
                              .then((snapshot) => {
                                if (!snapshot.empty) {
                                  console.log("dbg: snapshot.size: " + snapshot.size);
                                  snapshot.forEach((rentalDoc) => {
                                    let rentalData = rentalDoc.data();
                                    let dbUserRef = rentalData.userId;
                                    let stateUserRef = props.vm.userRef.doc(userId)
                                    if (JSON.stringify(dbUserRef._documentPath) == JSON.stringify(stateUserRef._documentPath)) {
                                      bookCount++;
                                    }
                                    console.log("dbg: count: " + count);
                                    if (count == snapshot.size - 1) {
                                      if (role == 'staff') {
                                        if (bookCount > 2) {
                                        alert("Sorry, but you are at your book limit")
                                        }
                                        else {
                                          alert("Yeah sure")
                                          let rentalInfo = {
                                            rentalDate: new Date(),
                                            dueDate: new Date(Date.now() + 1209600000),
                                            bookId: item.bookRef.ref
                                          }

                                          props.vm.bookRef.doc(item.bookRef.id).update({
                                            Available: false
                                          })

                                          props.vm.userRef.doc(userId).get()
                                          .then((doc) => {
                                            rentalInfo.userId = doc.ref;
                                            props.vm.arRef.add(rentalInfo)
                                          })
                                        }
                                      } else {
                                        if (bookCount > 1) {
                                          alert("Sorry, but you are at your book limit")
                                        }
                                        else {
                                          alert("Yeah sure")
                                          let rentalInfo = {
                                            rentalDate: new Date(),
                                            dueDate: new Date(Date.now() + 1209600000),
                                            bookId: item.bookRef.ref
                                          }

                                          props.vm.bookRef.doc(item.bookRef.id).update({
                                            Available: false
                                          })

                                          props.vm.userRef.doc(userId).get()
                                          .then((doc) => {
                                            rentalInfo.userId = doc.ref;
                                            props.vm.arRef.add(rentalInfo)
                                          })
                                        }
                                      }
                                    }
                                    count++;
                                  })
                                } else { // no current rentals in DB
                                  // Allow checkout
                                  console.log("dbg: no rentals");

                                    let rentalInfo = {
                                      rentalDate: new Date(),
                                      dueDate: new Date(Date.now() + 1209600000),
                                      bookId: item.bookRef.ref
                                    }

                                    props.vm.bookRef.doc(item.bookRef.id).update({
                                      Available: false
                                    })

                                    props.vm.userRef.doc(userId).get()
                                    .then((doc) => {
                                      rentalInfo.userId = doc.ref;
                                      props.vm.arRef.add(rentalInfo)
                                    })

                                }
                              })







                          })
                        })
                        // alert(new Date(rentalInfo.dueDate))
                      }}
                    >
                      <Text style={{ color: '#197278', fontWeight: 'bold', fontSize: 15}}>
                        {item.Available ? "Check Out" : "Reserve" }
                      </Text>
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Grid>
          </ListItem>
        )
      }} />
  )
}

const Filter = (props) => {
  return(
    <Form>
      <Item style={{backgroundColor: '#F7F7F2', borderRadius: 4}}>
        <Icon type="EvilIcons" name='search' />
        <Input
          autoCorrect={false}
          placeholder='Search'
          onChangeText={(text) => {
            if (text != "") {
              let filteredBooks = []
              for (book of props.books) {
                if (book.bookTitle.includes(text) || book.authorFName.includes(text) || book.authorLName.includes(text)) {
                  filteredBooks.push(book)
                }
              }
              props.vm.setState({
                filteredBooks: filteredBooks
              })
            } else {
              props.vm.setState({
                filteredBooks: []
              })
            }
          }}
        />
      </Item>
    </Form>
  )
}
