import React from 'react';
import { ActivityIndicator, AsyncStorage, View } from 'react-native';

export default class AuthLoading extends React.Component {
  constructor() {
    super();
    this._fetchUser()
  }

  // Fetch the token from storage then navigate to our appropriate place
  _fetchUser = async () => {
    const userId = await AsyncStorage.getItem('userId');

    console.log("dbg: userId in initial AuthLoading.js: " + userId);

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userId ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}
