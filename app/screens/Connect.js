import React from 'react';
import { Header, Left, Button, Thumbnail, Body, Title, Right, Icon, Text } from 'native-base'
import firebase from 'react-native-firebase'



export default class Connect extends React.Component {
  constructor() {
    super();
    /* When a notification is received but not displayed */
    this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
      firebase.notifications().displayNotification(notification)
    });
  }
  render() {
    return (
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
            <Thumbnail small square source={require('../../assets/Twitter_Logo_Blue.png')} />
        </Body>
        <Right />
      </Header>
    )
  }
}
