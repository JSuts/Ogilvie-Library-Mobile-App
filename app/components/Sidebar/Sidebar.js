import React, { Component } from 'react';
import {
  StyleSheet,
  Image
} from 'react-native';

import { Body, Button, Container, Content, Drawer, Footer, FooterTab, Header, Icon, Left, List, ListItem, Right, Text, Title, Thumbnail, Spinner } from 'native-base';



const routes = ["Home", "Catalog", "Connect", "Map", "FAQ", "Settings"];
export default class SideBar extends React.Component {
  render() {
    return (
      <Container>
        <Content style={{ backgroundColor: "rgb(58, 132, 173)", paddingTop: 20 }}>
          <List
            dataArray={routes}
            renderRow={data => {
              return (
                  <ListItem
                    button
                    onPress={() => {
                      this.props.navigation.navigate(data)}
                    }>
                    <Text>{data}</Text>
                  </ListItem>
              );
            }}
          />
        </Content>
      </Container>
    );
  }
}
