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
    this.vm = this;

  }



  render() {
    return (
      <Container>
        <Header style={{ backgroundColor: '#555555' }}>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("DrawerOpen")}>
              <Icon name="menu" style={{ color: "rgb(58, 132, 173)" }} />
            </Button>
          </Left>
          <Body>
            <Icon style={{fontSize: 15}} type="MaterialIcons" name="settings" />
            <Title style={{color: '#F7F7F2'}}>Settings</Title>
          </Body>
          <Right />
        </Header>
        <Content padder style={{backgroundColor: '#261C15', flex: 1}}>
          <Button
            style={{marginBottom: 20, backgroundColor: 'rgb(200,100,100)'}}
            onPress={() => {
              this.props.navigation.navigate("Report")
            }}
            >
            <Text>
              Send a bug report
            </Text>
          </Button>
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
            <Text style={{fontWeight: '100', fontSize: 10, color: '#F7F7F2' }}>
              TWITTER, TWEET, RETWEET and the Twitter logo are trademarks of Twitter, Inc. or its affiliates
            </Text>

        </Content>
      </Container>
    );
  }
}
