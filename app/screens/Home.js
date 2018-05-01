import React from "react";
import { StatusBar } from "react-native";
// import { store } from "../../store/store.js"
// import { signInAction, signOutAction } from "../../actions/actions.js"
import { List, ListItem, Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem, Spinner } from "native-base";
import { Col, Row, Grid } from "react-native-easy-grid";


export default class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      doneLoading: false,
      userData: {},
      books: [],
      lateBooks: [],
      reservations: []
    }
    // this._getInfo();
  }

  _getInfo() {
    let request = new XMLHttpRequest();

    request.onreadystatechange = (e) => {
      if (request.readyState == 4) {
        if (request.status == 200) {
          let data = JSON.parse(request.responseText);

          this._getBooks(data)

          this.setState({
            userData: data
          })
        } else {
          console.log(request.status);
          console.warn('fetching books failure :\\');
        }
      }
    }

    let url = "http://jake.westmec-coding.org/api/userInformation/"
    url += store.getState().loggedInUser
    request.open('GET', url)
    request.send();
  }


  _getBooks(books) {

      let request = new XMLHttpRequest();

      request.onreadystatechange = (e) => {
        if (request.readyState == 4) {
          if (request.status == 200) {
            let data = JSON.parse(request.responseText);

            this._getLateBooks(data, books.books)
            this._getReservations(data, books.reservations)

            this.setState({
              books: data
            })
          } else {
            console.log(request.status);
            console.warn('fetching books failure :\\');
          }
        }
      }


      let url = books.books.reduce((accumulator, book, i) => {
        if (i == (books.length - 1)) {
          return accumulator + book.bookID
        } else {
          return accumulator + book.bookID + "_"
        }
      }, "http://jake.westmec-coding.org/api/getBooks/")
      request.open('GET', url)
      request.send();
  }

  _getLateBooks(fullBook, dueDateObj) {
    let today = new Date()
    let lateBooks = dueDateObj.map((ddo, i) => {
      let dueDate = new Date(ddo.dueDate)
      if (dueDate < today) {
        fullBook[i].daysLate = Math.round((today - dueDate) / (1000 * 60 * 60 * 24));
        return fullBook[i]
      }
    })
    this.setState({
      lateBooks: lateBooks
    })
  }


  _getReservations(fullBook, info) {
    if (info.length == 0) {
      this.setState({
        doneLoading: true,
        reservations: []
      })
    } else {
      let request = new XMLHttpRequest();

      request.onreadystatechange = (e) => {
        if (request.readyState == 4) {
          if (request.status == 200) {
            let data = JSON.parse(request.responseText);

            this.setState({
              doneLoading: true,
              reservations: data
            })
          } else {
            console.log(request.status);
            console.warn('fetching books failure :\\');
          }
        }
      }


      let url = info.reduce((accumulator, reserve, i) => {
        if (i == (info.length - 1)) {
          return accumulator + reserve.bookID
        } else {
          return accumulator + reserve.bookID + "_"
        }
      }, "http://jake.westmec-coding.org/api/getBooks/")
      request.open('GET', url)
      request.send();
    }

    // let reservations = info.reservations.map((info, i) => {
    //
    // })
    // this.setState({
    //   doneLoading: true,
    //   reservations: reservations
    // })
  }



  render() {
    var count = 0; 
    return (
      <Container>
        <Header style={{ backgroundColor: 'lightblue' }}>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("DrawerOpen")}>
              <Icon name="menu" style={{ color: "rgb(58, 132, 173)" }} />
            </Button>
          </Left>
          <Body>
            <Title>Home</Title>
          </Body>
          <Right />
        </Header>


          {this.state.doneLoading == false ? <Spinner color='blue' /> : <RenderHomePage navigation={this.props.navigation} userData={this.state.userData} books={this.state.books} lateBooks={this.state.lateBooks} reservations={this.state.reservations} />}

      </Container>
    );
  }
}

class BookList extends React.Component {
  render() {
    return(
      <List
        dataArray={this.props.books}
        renderRow={(item) => {
          if (item != undefined) {
            return(
              <ListItem>
                <Text>
                  {item.bookTitle}
                </Text>
              </ListItem>
            )
          } else {
            return(null)
          }
        }}
      />
    )
  }
}


class VisitList extends React.Component {
  render() {
    return (
      <List>
        <ListItem onPress={() => {
          this.props.navigation.navigate("Browse");
        }}>
          <Text> Visit Our Catalog </Text>
        </ListItem>
      </List>
    )
  }
}


class LateList extends React.Component {
  render() {
    return(
      <List
        dataArray={this.props.books}
        renderRow={(item) => {
          if (item != undefined) {
            return(
              <ListItem>
                <Grid>
                  <Row>
                    <Text>
                      {item.bookTitle}
                    </Text>
                  </Row>
                  <Row>
                    <Text>
                      Day's Late: {item.daysLate}
                    </Text>
                  </Row>
              </Grid>
              </ListItem>
            )
          } else {
            return(null)
          }
        }}
      />
    )
  }
}

class RenderHomePage extends React.Component {
  render() {
    return (
      <Grid style={{ backgroundColor: 'skyblue' }}>
        <Row size={12} style={{ marginTop: 20, marginHorizontal: 10, borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>

            Welcome, {this.props.userData.name}!
          </Text>
        </Row>
          <Row size={28} style={{}}>
            <Content style={{ flex: 1, marginVertical: 25, marginHorizontal: 10, padding: 5, borderWidth: 3, borderColor: 'black', borderRadius: 5, backgroundColor: 'white'}}>
              <Text>
                Books Checked Out: {this.props.userData.books.length}
              </Text>
              {this.props.userData.books.length == 0 ? <VisitList navigation={this.props.navigation} /> : <BookList books={this.props.books} />}
            </Content>
          </Row>
          <Row size={20} style={{ }}>
            <Content style={{ flex: 1, marginVertical: 10, marginHorizontal: 10, padding: 5, borderWidth: 3, borderColor: 'black', borderRadius: 5, backgroundColor: 'white'}}>
              <Text>
                Late Books
              </Text>
              {this.props.lateBooks.length == 0 ? <Text>Good Job!</Text> : <LateList books={this.props.lateBooks} />}
            </Content>
          </Row>
          <Row size={20} style={{ }}>
            <Content style={{ flex: 1, marginVertical: 10, marginHorizontal: 10, padding: 5, borderWidth: 3, borderColor: 'black', borderRadius: 5, backgroundColor: 'white'}}>
              <Text>
                Reservations
              </Text>
              <BookList books={this.props.reservations} />
            </Content>
          </Row>
          <Row size={20} style={{ }}>
          </Row>
      </Grid>
    )
  }
}
