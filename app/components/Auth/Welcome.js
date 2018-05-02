import React from 'react';
import { Button, Content, Text } from 'native-base'
import { Col, Row, Grid } from "react-native-easy-grid";
import styles from './styles';


const Welcome = (props) => {
  return (
    <Content padder style={styles.contentContainer} >
      <Text style={styles.titleText}>
        Welcome, Hedgehog!
      </Text>
      <Text style={styles.titleText}>
         Please
      </Text>
      <Text style={styles.titleText}>
         Sign In or Sign Up
      </Text>
      <Grid>
        <Row>
          <Col size={50}>
            <Button
              style={styles.button}
              block
              onPress={() => {
                props.vm.setState({
                  initialState: false,
                  signIn: true
                })
              }}
            >
              <Text style={styles.buttonText}>
                Sign In
              </Text>
            </Button>
          </Col>
          <Col size={1}></Col>
          <Col size={50}>
          <Button
            style={styles.button}
            block
            onPress={() => {
              props.vm.setState({
                initialState: false,
                signUp: true
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
    </Content>
  )
}

export default Welcome;
