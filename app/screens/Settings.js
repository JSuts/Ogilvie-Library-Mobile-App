import React from 'react';
import { AsyncStorage, View, Image, FlatList, ImageBackground } from 'react-native';
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

// import Sidebar from './sidebar.js';
// import styles from '../styles.js';


export default class Settings extends React.Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
    }
  }



  render() {
    return (
      <Container>
        <Button
          onPress={() => {
            let userKeys = [
              'userId',
              'fees',
              'lName',
              'role',
              'username',
              'email',
              'fName'
            ]
            AsyncStorage.multiRemove(userKeys)
            .then((response) => {
              console.log("dbg: remove userKeys keys: " + response);
              this.props.navigation.navigate("AuthLoading")
            })
            .catch((err) => {
              alert("Error Signing Out... ");
              console.log("Error Signing Out... Error: " + err);
            })
          }}
        >
          <Text>
            Sign Out
          </Text>
        </Button>
      </Container>
    );
  }
}
