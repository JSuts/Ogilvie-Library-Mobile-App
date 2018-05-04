import React from 'react';
import { ActivityIndicator, Image } from 'react-native'
import { Container } from 'native-base';

import { Activity, Welcome, SignIn, SignUp, Error, TopBuffer } from '../components/Auth'

export default class Auth extends React.Component {
  constructor() {
    super();
    this.vm = this;
    this.state = {
      loading: false,
      initialState: true,
      signIn: false,
      signUp: false,
      username: "",
      password: "",
      newFName: "",
      newLName: "",
      newEmail: "",
      newUsername: "",
      newPassword: "",
      newPasswordConfirm: "",
      staffKey: "",
      invalidEmail: false,
      invalidPasswords: false,
      dirtyField: false,
      dirtyEmail: false
    }
  }

  render() {
    return (
      <Container>
        {/* <TopBuffer /> */}
        { this.state.signUp && (this.state.invalidEmail || this.state.invalidPasswords) && <Error /> }
        { this.state.loading && <Activity /> }
        { this.state.initialState && <Welcome vm={this.vm} /> }
        { this.state.signIn && <SignIn vm={this.vm} /> }
        { this.state.signUp && <SignUp vm={this.vm} /> }
      </Container>
    );
  }
}
