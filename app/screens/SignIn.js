import React from 'react';
import { View, Image, FlatList, ImageBackground } from 'react-native';
import {
  Container,
  Icon,
  Drawer,
  Button,
  Header,
  Left,
  Body,
  Title,
  Text,
  Right,
  Content,
  Form,
  Item,
  Input,
  List,
  ListItem,
  Thumbnail,
  Footer,
  FooterTab,
} from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
// import { signInAction } from "../../actions/actions.js"
// import { store } from "../../store/store.js"
// import { HomeScreen } from "../HomeScreen/index.js"
// import md5 from 'md5';

// import Sidebar from './sidebar.js';
// import styles from '../styles.js';


export default class SignIn extends React.Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
    }
  }

  _checkFields = () => {
    let username = this.state.username;
    let password = this.state.password;

    if (username == "") {
      alert("Please Enter your Username");
    } else {
      if (password == "") {
        alert("Please Enter your Password");
      } else {
        if (username.match(/^[a-zA-Z]+\.\d+$/)) {
          this._validateLogIn();
        } else {
          alert("Username does not match format");
        }
      }
    }
  }

  _validateLogIn = async () => {
    let request = new XMLHttpRequest();

    request.onreadystatechange = (e) => {
      if (request.readyState == 4) {
        if (request.status == 200) {
          let data = JSON.parse(request.responseText);
          let lastName = data[0].memberLName;
          let md5Password = data[0].password;
          let password = this.state.password;
          if (lastName.toLowerCase() == username[0].toLowerCase()) {
            if (md5Password == md5(password)) {
              store.dispatch(signInAction(userId))
              this.props.navigation.navigate("App")
            } else {
              alert("Password does not match");
            }
          } else {
            alert("Username does not match")
          }

        } else {
          console.log(request.status);
          console.warn('fetching user credentials failure :\\');
        }
      }
    }

    let url = "http://jake.westmec-coding.org/api/getUser/"
    var username = this.state.username;
    username = username.split(".");
    var userId = username[1];
    url += userId

    request.open('GET', url);
    request.send();
  }

  render() {
    return (
      <Container>
          <Content padder style={{ backgroundColor: 'black', paddingTop: 100 }} >
            <Text style={{fontSize: 20, fontWeight: 'bold', color: 'rgb(0, 140, 255)', alignSelf: 'center'}}>
              Welcome, Hedgehog!
            </Text>
            <Text style={{fontSize: 20, fontWeight: 'bold', color: 'rgb(0, 140, 255)', alignSelf: 'center'}}>
               Please
            </Text>
            <Text style={{fontSize: 20, fontWeight: 'bold', color: 'rgb(0, 140, 255)', alignSelf: 'center'}}>
               Sign In or Sign Up
            </Text>
            <Grid>
              <Row>
                <Col size={50}>
                  <Button primary block onPress={() => this.props.navigation.navigate("App")}>
                    <Text>
                      Sign In
                    </Text>
                  </Button>
                </Col>
                <Col size={1}></Col>
                <Col size={50}>
                <Button primary block>
                  <Text>
                    Sign Up
                  </Text>
                </Button>
              </Col>
              </Row>
            </Grid>
          </Content>
        </Container>
    );
  }
}
