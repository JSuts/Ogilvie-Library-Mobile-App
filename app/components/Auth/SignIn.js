import React from 'react';
import { AsyncStorage, Keyboard } from 'react-native'
import { Button, Content, Form, Input, Text } from 'native-base'
import { Col, Row, Grid } from "react-native-easy-grid";
import styles from './styles';

import AuthServices from '../../lib/AuthServices'

const SignIn = (props) => {
  return (
    <Content padder style={styles.contentContainer} >
      <Text style={styles.titleText}>
        Welcome, Hedgehog!
      </Text>
      <Text style={styles.titleText}>
         Please Sign In
      </Text>
      <Form>
        <Grid>
          <Row style={{flex: 1}}>
            <Col style={{ flex: 1, borderWidth: 0}}>
              <Input
                placeholder="Username"
                style={{color: 'white'}}
                autoCorrect={false}
                autoFocus={true}
                returnKeyType='next'
                enablesReturnKeyAutomatically={true}
                onChangeText={(text) => props.vm.setState({ username: text})}
                value={props.vm.state.username}
              />
            </Col>
            <Col style={{ flex: 1, borderWidth: 0}}>
              <Input
                placeholder="Password"
                style={{color: 'white'}}
                secureTextEntry={true}
                autoCorrect={false}
                enablesReturnKeyAutomatically={true}
                onChangeText={(text) => props.vm.setState({ password: text})}
                value={props.vm.state.password}
              />
            </Col>
          </Row>
          <Row style={{flex:1}}>
            <Col>
              <Button
                style={styles.button}
                block
                onPress={() => {
                  Keyboard.dismiss();
                  props.vm.setState({
                    signIn: false,
                    loading: true,
                  })
                  AuthServices.signIn(props.vm.state.username, props.vm.state.password)
                  .then((response) => {
                    let setPairs = [
                      ['userId', response.docId],
                      ['fName', response.userData.fName],
                      ['lName', response.userData.lName],
                      ['role', response.userData.role],
                      ['fees', response.userData.fees.toString()],
                      ['username', response.userData.username],
                      ['email', response.userData.email]
                    ]
                    AsyncStorage.multiSet(setPairs)
                    .catch((err) => {
                      alert("Error saving user information to local storage. Error: " + err)
                    })
                    props.vm.props.navigation.navigate("App");
                  })
                  .catch((err) => {
                    props.vm.setState({
                      loading: false,
                      signIn: true,
                    }, () => alert(err))
                  })
                }}
              >
                <Text style={styles.buttonText}>
                  Sign In
                </Text>
              </Button>
            </Col>
          </Row>
          <Row style={{flex:1}}>
            <Col>
              <Button
                style={styles.button}
                small
                onPress={() => {
                  props.vm.setState({
                    signUp: true,
                    signIn: false
                  })
                }}
              >
                <Text style={styles.buttonText}>
                  Sign Up
                </Text>
              </Button>
            </Col>
          </Row>
        </Grid>
      </Form>
    </Content>
  )
}

export default SignIn;
