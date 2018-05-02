import React from 'react';
import { AsyncStorage, Keyboard } from 'react-native'
import { Button, Content, Form, Input, Item, Label, Text } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import styles from './styles';

import AuthServices from '../../lib/AuthServices'



const SignUp = (props) => {
  return (
    <Content padder style={styles.contentContainer} >
      <Text style={styles.titleText}>
        Welcome, Hedgehog!
      </Text>
      <Text style={styles.titleText}>
         Please Sign Up
      </Text>
      <Form>
        <Grid>
          <Row style={{flex: 1}}>
            <Col style={{ flex: 1, borderWidth: 0 }}>
              <Item floatingLabel>
                <Label>
                  First Name
                </Label>
                <Input
                  style={{color: 'white'}}
                  autoFocus={true}
                  returnKeyType='next'
                  enablesReturnKeyAutomatically={true}
                  onChangeText={(text) => props.vm.setState({ newFName: text })}
                  value={props.vm.state.newFName}
                />
              </Item>
            </Col>
            <Col style={{ flex: 1, borderWidth: 0 }}>
              <Item floatingLabel>
                <Label>
                  Last Name
                </Label>
                <Input
                  style={{color: 'white'}}
                  returnKeyType='next'
                  enablesReturnKeyAutomatically={true}
                  onChangeText={(text) => props.vm.setState({ newLName: text })}
                  value={props.vm.state.newLName}
                />
              </Item>
            </Col>
          </Row>
          <Row style={{flex: 1}}>
            <Col style={{ flex: 1, borderWidth: 0 }}>
              <Item inlineLabel error={props.vm.state.invalidEmail} >
                <Label>
                  Email
                </Label>
                <Input
                  style={{color: 'white'}}
                  returnKeyType='next'
                  autoCorrect={false}
                  keyboardType="email-address"
                  enablesReturnKeyAutomatically={true}
                  onChangeText={(text) => {
                    props.vm.setState({ newEmail: text }, () => {
                      if (props.vm.state.dirtyEmail) {
                        let regEx = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
                        props.vm.setState({
                          invalidEmail: !(regEx.test(text))
                        })
                      }
                    })
                  }}
                  value={props.vm.state.newEmail}
                  onBlur={() => {
                    props.vm.setState({ dirtyEmail: true }, () => {
                      if (props.vm.state.dirtyEmail) {
                        let regEx = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
                        props.vm.setState({
                          invalidEmail: !(regEx.test(props.vm.state.newEmail))
                        })
                      }
                    })
                  }}
                />
              </Item>
            </Col>
          </Row>
          <Row>
            <Col style={{ flex: 1, borderWidth: 0 }}>
              <Item inlineLabel>
                <Label>
                  Username
                </Label>
                <Input
                  style={{color: 'white'}}
                  returnKeyType='next'
                  autoCorrect={false}
                  enablesReturnKeyAutomatically={true}
                  onChangeText={(text) => props.vm.setState({ newUsername: text })}
                  value={props.vm.state.newUsername}
                />
              </Item>
            </Col>
          </Row>
          <Row>
            <Col style={{ flex: 1, borderWidth: 0 }}>
              <Item inlineLabel error={props.vm.state.invalidPasswords}>
                <Label>
                  Password
                </Label>
                <Input
                  style={{color: 'white'}}
                  returnKeyType='next'
                  secureTextEntry={true}
                  enablesReturnKeyAutomatically={true}
                  onChangeText={(text) => {
                    props.vm.setState({ newPassword: text }, () => {
                      if (props.vm.state.dirtyField) {
                        if (props.vm.state.newPassword != props.vm.state.newPasswordConfirm) {
                          props.vm.setState({
                            invalidPasswords: true
                          });
                        } else {
                          props.vm.setState({
                            invalidPasswords: false
                          });
                        }
                      }
                    })
                  }}
                  value={props.vm.state.newPassword}
                  onBlur={() => {
                    if (props.vm.state.newPassword != "" && props.vm.state.newPasswordConfirm != "" || props.vm.state.dirtyField) {
                      if (props.vm.state.newPassword != props.vm.state.newPasswordConfirm) {
                        props.vm.setState({
                          invalidPasswords: true
                        });
                      } else {
                        props.vm.setState({
                          invalidPasswords: false
                        });
                      }
                    }
                  }}
                />
              </Item>
            </Col>
          </Row>
          <Row>
            <Col style={{ flex: 1, borderWidth: 0 }}>
              <Item inlineLabel error={props.vm.state.invalidPasswords}>
                <Label>
                  Confirm Password
                </Label>
                <Input
                  style={{color: 'white'}}
                  returnKeyType='done'
                  secureTextEntry={true}
                  enablesReturnKeyAutomatically={true}
                  onChangeText={(text) => {
                    props.vm.setState({ newPasswordConfirm: text}, () => {
                      if (props.vm.state.dirtyField) {
                        if (props.vm.state.newPassword != props.vm.state.newPasswordConfirm) {
                          props.vm.setState({
                            invalidPasswords: true
                          });
                        } else {
                          props.vm.setState({
                            invalidPasswords: false
                          });
                        }
                      }
                    })
                  }}
                  value={props.vm.state.newPasswordConfirm}
                  onBlur={() => {
                    props.vm.setState({
                      dirtyField: true
                    }, () => {
                      if (props.vm.state.dirtyField) {
                        if (props.vm.state.newPassword != props.vm.state.newPasswordConfirm) {
                          props.vm.setState({
                            invalidPasswords: true
                          });
                        } else {
                          props.vm.setState({
                            invalidPasswords: false
                          });
                        }
                      }
                    })
                  }}
                />
              </Item>
            </Col>
          </Row>
          <Row style={{ marginTop: 10 }}>
            <Col>
              <Button
                disabled={props.vm.state.invalidPasswords || props.vm.state.invalidEmail}
                style={styles.button}
                block
                onPress={() => {
                  Keyboard.dismiss();
                  if (props.vm.state.newFName == "") {
                    alert("Please enter your first name")
                  } else if (props.vm.state.newLName == "") {
                    alert("Please enter your last name")
                  }
                  else if (props.vm.state.newEmail == "") {
                    alert("Please enter your email")
                  }
                  else if (props.vm.state.newUsername == "") {
                    alert("Please enter your username")
                  }
                  else if (props.vm.state.newPassword == "") {
                    alert("Please enter your password")
                  }
                  else if (props.vm.state.newPasswordConfirm == "") {
                    alert("Please confirm your password")
                  } else {
                    props.vm.setState({
                      loading: true,
                      signUp: false,
                    });
                    AuthServices.signUp(
                      props.vm.state.newFName,
                      props.vm.state.newLName,
                      props.vm.state.newEmail,
                      props.vm.state.newUsername,
                      props.vm.state.newPassword
                    )
                    .then((response) => {
                      alert(response)
                      // props.vm.navigation.navigate("App");
                    })
                    .catch((err) => {
                      props.vm.setState({
                        loading: false,
                        signUp: true,
                      })
                      alert(err)
                    });
                  }
                }}
              >
                <Text style={styles.buttonText}>
                  Sign Up
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
                    signUp: false,
                    signIn: true
                  })
                }}
              >
                <Text style={styles.buttonText}>
                  Sign In
                </Text>
              </Button>
            </Col>
          </Row>
        </Grid>
      </Form>
    </Content>
  )
}
export default SignUp;
