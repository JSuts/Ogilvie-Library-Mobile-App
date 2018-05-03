import React from 'react';
import { StyleSheet, View, Image, FlatList } from 'react-native';
import { Root, ActionSheet, Body, Button, Container, Content, Drawer, Footer, FooterTab, Header, Icon, Left, List, ListItem, Right, Text, Title, Thumbnail, Spinner } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
// import { store } from "../../store/store.js"
import firebase from 'react-native-firebase'




class DisplayBooks extends React.Component {
  constructor() {
    super();
  }

  _checkoutBook(bookId, bookTitle) {
    let request = new XMLHttpRequest();

    request.onreadystatechange = (e) => {
      if (request.readyState == 4) {
        if (request.status == 200) {
          let data = JSON.parse(request.responseText);
          let affectedRows = data.affectedRows;
          if (affectedRows > 0) {
            alert("Successfully Checked out " + bookTitle);
          } else {
            alert("Unable to check out " + bookTitle);
          }
        } else {
          console.log(request.status);
          console.warn('sending checkout request failure :\\');
        }
      }
    }

    let url = "http://jake.westmec-coding.org/api/checkoutBook/"
    url += (store.getState().loggedInUser.toString()) + "/"
    url += bookId

    request.open('GET', url);
    request.send();

  }


  _reserveBook(bookId, bookTitle) {
    let request = new XMLHttpRequest();

    request.onreadystatechange = (e) => {
      if (request.readyState == 4) {
        if (request.status == 200) {
          let data = JSON.parse(request.responseText);
          let affectedRows = data.affectedRows;
          if (affectedRows > 0) {
            alert("Successfully reserved " + bookTitle);
          } else {
            alert("Unable to reserve " + bookTitle);
          }
        } else {
          console.log(request.status);
          console.warn('sending checkout request failure :\\');
        }
      }
    }

    let url = "http://jake.westmec-coding.org/api/reserveBook/"
    url += (store.getState().loggedInUser.toString()) + "/"
    url += bookId

    request.open('GET', url);
    request.send();

  }

  renderBooks() {
    if (this.props.books.length == 0) {

      return <Spinner color='red' />
    } else {
      return this.props.books.map((book, i) => {
        let bookObj = {
          title: book.bookTitle,
          author: book.authorFName + ' ' + book.authorLName,
          coverURL: book.coverURL,
          available: book.available
        }
        bookObj.available = bookObj.available == "T" ? "Available" : "Taken";
        return(
          <ListItem key={book.bookID} style={{flex: 1, marginLeft: 0, paddingRight: 0 }} onPress={() => {
            if (book.available == "T") {
              ActionSheet.show(
                {
                  options: [
                    { text: "Checkout", icon: "md-checkmark", iconColor: "#2c8ef4" },
                    { text: "Cancel", icon: "close", iconColor: "#25de5b" }
                  ],
                  cancelButtonIndex: 1,
                  title: bookObj.title
                },
                buttonIndex => {
                  switch (buttonIndex) {
                    case 0:
                      this._checkoutBook(book.bookID, bookObj.title);
                      break;
                    default:

                  }
                }
              )
            } else {
              ActionSheet.show(
                {
                  options: [
                    { text: "Reserve", icon: "md-time", iconColor: "#2c8ef4" },
                    { text: "Cancel", icon: "close", iconColor: "#25de5b" }
                  ],
                  cancelButtonIndex: 1,
                  title: bookObj.title
                },
                buttonIndex => {
                  switch (buttonIndex) {
                    case 0:
                    this._reserveBook(book.bookID, bookObj.title)
                    break;
                    default:

                  }
                }
              )

            }
          }}>
          <Grid>
            <Col size={1}>
              {/* <Thumbnail square large style={{resizeMode: 'contain'}} source={{ uri: bookObj.coverURL }} defaultSource={require('../../../Images/Book_Placeholder.png')} /> */}
              {/* {bookObj.coverURL != null ? <Thumbnail large square style={{resizeMode: 'contain'}} source={{ uri: bookObj.coverURL }} /> : <Thumbnail square large style={{resizeMode: 'contain'}} defaultSource={require('../../../Images/Book_Placeholder.png')} /> } */}
            </Col>
            <Col size={4} style={{ alignItems: 'center'}}>
              <Row>
                <Text>Title: {bookObj.title}</Text>
              </Row>
              <Row>
                <Text>Author: {bookObj.author}</Text>
              </Row>
            </Col>
            <Col size={1} >
              <Text>{bookObj.available}</Text>
            </Col>
          </Grid>
        </ListItem>
      );
    });
    }
  }

  render() {
    return (
      <List style={{ flex: 1 }}>
        {this.renderBooks()}
      </List>
    );
  }
}



export default class Catalog extends React.Component {
  constructor() {
    super();
    this.state = {
      books: []
    }
    /* When a notification is received but not displayed */
    this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
      firebase.notifications().displayNotification(notification)
    });
    this._getBooks()
  }




  _getBooks() {
    let request = new XMLHttpRequest();

    request.onreadystatechange = (e) => {
      if (request.readyState == 4) {
        if (request.status == 200) {
          let data = JSON.parse(request.responseText);

          this.setState({
            books: data
          })


        } else {
          console.log(request.status);
          console.warn('fetching books failure :\\');
        }
      }
    }

    let url = "http://jake.westmec-coding.org/api/getBooks"
    request.open('GET', url)
    request.send();
  }

  render() {
    return (
        <Container>
          <Header style={{ backgroundColor: 'lightblue'}}>
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
          </Header>

          <Content style={{backgroundColor: 'skyblue'}}>
            <Grid>
              {/* Info Bar at the top of the Books */}
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

              {/* Books */}
              <Row size={8}>
                <DisplayBooks books={this.state.books} />
              </Row>
            </Grid>
          </Content>
        </Container>
    );
  }
}
