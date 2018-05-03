import React from 'react';
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
    return (null)
  }
}
