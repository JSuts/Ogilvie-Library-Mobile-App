import React from 'react';
import { StyleSheet, View, Image, FlatList } from 'react-native';
import { Root, ActionSheet, Body, Input, Button, Container, Content, Drawer, Footer, FooterTab, Header, Icon, Left, List, ListItem, Right, Text, Title, Thumbnail, Spinner, Form, Item } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
// import { store } from "../../store/store.js"
import firebase from 'react-native-firebase'

let db = firebase.firestore();
let settings = db.settings;
settings.areTimestampsInSnapshotsEnabled = true;
db.settings = settings;



// class DisplayBooks extends React.Component {
//   constructor() {
//     super();
//   }
//
//   _checkoutBook(bookId, bookTitle) {
//     let request = new XMLHttpRequest();
//
//     request.onreadystatechange = (e) => {
//       if (request.readyState == 4) {
//         if (request.status == 200) {
//           let data = JSON.parse(request.responseText);
//           let affectedRows = data.affectedRows;
//           if (affectedRows > 0) {
//             alert("Successfully Checked out " + bookTitle);
//           } else {
//             alert("Unable to check out " + bookTitle);
//           }
//         } else {
//           console.log(request.status);
//           console.warn('sending checkout request failure :\\');
//         }
//       }
//     }
//
//     let url = "http://jake.westmec-coding.org/api/checkoutBook/"
//     url += (store.getState().loggedInUser.toString()) + "/"
//     url += bookId
//
//     request.open('GET', url);
//     request.send();
//
//   }
//
//
//   _reserveBook(bookId, bookTitle) {
//     let request = new XMLHttpRequest();
//
//     request.onreadystatechange = (e) => {
//       if (request.readyState == 4) {
//         if (request.status == 200) {
//           let data = JSON.parse(request.responseText);
//           let affectedRows = data.affectedRows;
//           if (affectedRows > 0) {
//             alert("Successfully reserved " + bookTitle);
//           } else {
//             alert("Unable to reserve " + bookTitle);
//           }
//         } else {
//           console.log(request.status);
//           console.warn('sending checkout request failure :\\');
//         }
//       }
//     }
//
//     let url = "http://jake.westmec-coding.org/api/reserveBook/"
//     url += (store.getState().loggedInUser.toString()) + "/"
//     url += bookId
//
//     request.open('GET', url);
//     request.send();
//
//   }
//
//   renderBooks() {
//     if (this.props.books.length == 0) {
//
//       return <Spinner color='red' />
//     } else {
//       return this.props.books.map((book, i) => {
//         let bookObj = {
//           title: book.bookTitle,
//           author: book.authorFName + ' ' + book.authorLName,
//           coverURL: book.coverURL,
//           available: book.available
//         }
//         bookObj.available = bookObj.available == "T" ? "Available" : "Taken";
//         return(
//           <ListItem key={book.bookID} style={{flex: 1, marginLeft: 0, paddingRight: 0 }} onPress={() => {
//             if (book.available == "T") {
//               ActionSheet.show(
//                 {
//                   options: [
//                     { text: "Checkout", icon: "md-checkmark", iconColor: "#2c8ef4" },
//                     { text: "Cancel", icon: "close", iconColor: "#25de5b" }
//                   ],
//                   cancelButtonIndex: 1,
//                   title: bookObj.title
//                 },
//                 buttonIndex => {
//                   switch (buttonIndex) {
//                     case 0:
//                       this._checkoutBook(book.bookID, bookObj.title);
//                       break;
//                     default:
//
//                   }
//                 }
//               )
//             } else {
//               ActionSheet.show(
//                 {
//                   options: [
//                     { text: "Reserve", icon: "md-time", iconColor: "#2c8ef4" },
//                     { text: "Cancel", icon: "close", iconColor: "#25de5b" }
//                   ],
//                   cancelButtonIndex: 1,
//                   title: bookObj.title
//                 },
//                 buttonIndex => {
//                   switch (buttonIndex) {
//                     case 0:
//                     this._reserveBook(book.bookID, bookObj.title)
//                     break;
//                     default:
//
//                   }
//                 }
//               )
//
//             }
//           }}>
//           <Grid>
//             <Col size={1}>
//               {/* <Thumbnail square large style={{resizeMode: 'contain'}} source={{ uri: bookObj.coverURL }} defaultSource={require('../../../Images/Book_Placeholder.png')} /> */}
//               {/* {bookObj.coverURL != null ? <Thumbnail large square style={{resizeMode: 'contain'}} source={{ uri: bookObj.coverURL }} /> : <Thumbnail square large style={{resizeMode: 'contain'}} defaultSource={require('../../../Images/Book_Placeholder.png')} /> } */}
//             </Col>
//             <Col size={4} style={{ alignItems: 'center'}}>
//               <Row>
//                 <Text>Title: {bookObj.title}</Text>
//               </Row>
//               <Row>
//                 <Text>Author: {bookObj.author}</Text>
//               </Row>
//             </Col>
//             <Col size={1} >
//               <Text>{bookObj.available}</Text>
//             </Col>
//           </Grid>
//         </ListItem>
//       );
//     });
//     }
//   }
//
//   render() {
//     return (
//       <List style={{ flex: 1 }}>
//         {this.renderBooks()}
//       </List>
//     );
//   }
// }










export default class Catalog extends React.Component {
  constructor() {
    super();
    this.vm = this;
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
        if (bookData.bookTitle.includes(", The")) {
          bookData.bookTitle = "The " + bookData.bookTitle.substr(0, (bookData.bookTitle.length - 5))
        }

        let curTime = new Date();

        bookData.bookRef = bookDoc;
        bookData.key = count.toString();

        booksArray.push(bookData)
        this.setState({ books: booksArray });
        if (count == (snapshot.size - 1)) {
          setTimeout(() => this.setState({ doneLoading: true })
          , 350);
        }
        count++
      })
    })
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
              <Title style={{color: '#F7F7F2'}}>Catalog</Title>
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
          <ListItem style={{backgroundColor: '#F7F7F2', paddingLeft: 5, marginVertical: 10, flex: 1, borderRadius: 3 }}>
            <Grid>
              <Col size={3}>
                <Thumbnail square large style={{ height: 100,resizeMode: 'contain'}} source={{ uri: item.coverURL }} defaultSource={require('../../assets/Book_Placeholder.png')} />
              </Col>
              <Col size={8} style={{ alignItems: 'center' }}>
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
                  <Col style={{flex: 1, justifyContent: 'flex-end'  }}>
                    <Button
                      small
                      style={{ backgroundColor: '#197278', alignSelf: 'flex-end'}}
                      onPress={() => {
                        alert("No")
                      }}
                    >
                      <Text style={{ fontWeight: 'bold', fontSize: 15}}>
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
