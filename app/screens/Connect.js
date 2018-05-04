import React from 'react';
import { AsyncStorage, WebView } from 'react-native'
import { Container, Content, Header, Spinner, Left, List, ListItem, Button, Thumbnail, Input, Body, Title, Right, Icon, Text, Form } from 'native-base'
import firebase from 'react-native-firebase'
import { Col, Row, Grid } from "react-native-easy-grid";



export default class Connect extends React.Component {
  constructor() {
    super();
    this.vm = this
    this.state = {
      tweetsArray: [],
      loading: true,
    }
    /* When a notification is received but not displayed */
    this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
      firebase.notifications().displayNotification(notification)
    });
    this._initialConnect();
  }

  _initialConnect(navEvent) {
    fetch('http://jake.westmec-coding.org/api/connect')
    .then(response => response.json())
    .then((tweets) => {
      let tweetsArray = []
      for (tweet of tweets.statuses) {
        // console.log("dbg: tweets: " + JSON.stringify(tweet.text));
        tweetsArray.push(tweet)
      }
      this.setState({ tweetsArray: tweetsArray, loading: false })
    })
  }

  render() {
    return (
      <Container>
        {this.state.loading ? <Spinner color='lightblue' /> :
          <MainPage navigation={this.props.navigation} vm={this.vm} tweets={this.state.tweetsArray} />
        }
        {this.state.tweetsArray.length < 1 ? <Text style={{fontWeight: 'bold'}}>This page searches for tweets containing #OgilvieLibrary. Either there are no tweets or the server is having problems. Try tweeting about #OgilvieLibrary to give it a try!</Text> : (null)}
      </Container>
    )
  }
}

const MainPage = (props) => {
  return (
    <Container>
      <Header style={{ backgroundColor: '#555555' }}>
        <Left>
          <Button
            transparent
            onPress={() => props.navigation.navigate("DrawerOpen")}>
            <Icon name="menu" style={{ color: "rgb(58, 132, 173)" }} />
          </Button>
        </Left>
        <Body>
          <Thumbnail small square source={require('../../assets/Twitter_Logo_Blue.png')} />
        </Body>
        <Right>
          <Button
            transparent
            large
            onPress={() => {
              props.vm.setState({
                loading: true
              })
              props.vm._initialConnect();
            }}
            >
            <Icon name='refresh' />
          </Button>
        </Right>
      </Header>
      <Content>
        <List
          dataArray={props.tweets}
          renderRow={(item) => {
            if (item != undefined) {
              return(
                <ListItem>
                  <Grid>
                    <Col size={1}>
                      <Thumbnail medium round source={{ uri: item.user.profile_image_url_https }} />
                    </Col>
                    <Col size={4}>
                      <Row>
                          <Text style={{fontWeight: 'bold'}}>
                            {item.user.name + " "}
                            <Text style={{fontWeight: '100'}}>
                              {"@" + item.user.screen_name + " "}
                            </Text>
                          </Text>
                      </Row>
                      <Row>
                        <Text style={{fontWeight: '100'}}>
                          {item.created_at.substring(0, item.created_at.lastIndexOf(":"))}
                        </Text>
                      </Row>
                      <Row>
                        <Text>
                          {item.text}
                        </Text>
                      </Row>
                    </Col>
                  </Grid>
                </ListItem>
              )
            }
          }}
        />
      </Content>
    </Container>
  )
}
