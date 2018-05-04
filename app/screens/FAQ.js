import React from 'react';
import { Header, Left, Button, Thumbnail, Body, Title, Right, Icon, Text, Container, List, ListItem, Content } from 'native-base'
import { Col, Row, Grid } from "react-native-easy-grid";

export default class FAQ extends React.Component {
  constructor() {
    super();
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
            <Icon style={{fontSize: 15}} type="MaterialCommunityIcons" name="comment-question" />
            <Title style={{color: '#F7F7F2'}}>FAQ</Title>
          </Body>
          <Right />
        </Header>
        <Content padder style={{backgroundColor: '#261C15', flex: 1}}>
          <List
            style={{ flex: 1 }}
            dataArray={QandA}
            renderRow={(item) => {
              return(
                <ListItem>
                  <Grid>
                    <Row>
                      <Text style={{color: '#F7F7F2', fontWeight: 'bold', marginBottom: 8}}>
                        {"Question: " + item.question}
                      </Text>
                    </Row>
                    <Row>
                      <Text style={{color: '#F7F7F2', fontWeight: '200'}}>
                        {"Answer: " + item.answer}
                      </Text>
                    </Row>
                  </Grid>
                </ListItem>
              )
            }}
          />
        </Content>
      </Container>
    )
  }
}



var QandA = [
  {
    question: "Why can I only check out  2/3  books?",
    answer: "Ogilvie Library has strict demands that students may only check out 2 books at a time, and teachers 3.",
  },
  {
    question: "I have late fees. How can I pay them?",
    answer: "If you have acquired fees, please check in to the Ogilvie Library Help Desk and an employee will gladly explain the process of dealing with the fee.",
  },
  {
    question: "What if the book I want is unavailable?",
    answer: "This means the book you want is currently checked out. It should be returned and able to be taken within two weeks.",
  },
  {
    question: "Is there a way for me to keep the book longer than 2 weeks?",
    answer: "Unfortunately no. Not without gaining fees. However, if you return the book and nobody else has requested it after you, you may re-check it out.",
  },
  {
    question: "What is the purpose of the Connect tab?",
    answer: "The Connect page shows anyone tweeting about our library. In attempts to fit in with the kids.",
  },

]
