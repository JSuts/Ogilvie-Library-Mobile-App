import React from 'react';
import { AsyncStorage, View, Image, FlatList, ImageBackground, Keyboard } from 'react-native';
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

import firebase from 'react-native-firebase';



let db = firebase.firestore();
let settings = db.settings;
settings.areTimestampsInSnapshotsEnabled = true;
db.settings = settings;


export default class Settings extends React.Component {
  constructor() {
    super();
    this.vm = this;
    this.bugRef = db.collection('bugReport');

    this.state = {
      user: "",
      bugReport: ""
    }
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
            <Title style={{color: '#F7F7F2'}}>Bug Report</Title>
          </Body>
          <Right />
        </Header>

        <Content padder style={{backgroundColor: '#261C15', flex: 1}}>
          <Form>
            <Grid>
              <Row style={{flex: 1}}>
                <Col style={{ flex: 1, borderWidth: 0}}>
                  <Input
                    placeholder="Name"
                    style={{color: 'white'}}
                    autoCorrect={false}
                    autoFocus={true}
                    returnKeyType='next'
                    enablesReturnKeyAutomatically={true}
                    onChangeText={(text) => this.setState({ user: text})}
                    value={this.state.user}
                  />
                </Col>
              </Row>
              <Row>
                <Col style={{ flex: 1, borderWidth: 0}}>
                  <Input
                    placeholder="Bug Report"
                    style={{color: 'white'}}
                    autoCorrect={false}
                    enablesReturnKeyAutomatically={true}
                    onChangeText={(text) => this.setState({ bugReport: text})}
                    value={this.state.bugReport}
                  />
                </Col>
              </Row>
              <Row style={{flex:1}}>
                <Col>
                  <Button
                    style={{marginBottom: 20, backgroundColor: 'rgb(200,100,100)'}}
                    block
                    onPress={() => {
                      Keyboard.dismiss();
                      if (this.state.user == "") {
                        alert("Please fill in your name")
                      } else if (this.state.bugReport = "") {
                        alert("Please fill in your bug report")
                      } else {
                        let report = {
                          user: this.state.user,
                          message: this.state.bugReport
                        }
                        this.bugRef.add(report)
                        alert("Your bug report has been submitted. Thank you!")
                        this.props.navigation.navigate("Home");
                      }

                    }}
                  >
                    <Text>
                      Send bug report
                    </Text>
                  </Button>
                </Col>
              </Row>
            </Grid>
          </Form>
        </Content>
      </Container>
    );
  }
}
