import React from 'react';
import { Header, Left, Button, Thumbnail, Body, Title, Right, Icon, Text } from 'native-base'

export default class FAQ extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
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
          <Title style={{color: '#F7F7F2'}}>Map</Title>
        </Body>
        <Right />
      </Header>
    )
  }
}
