import React, { Component } from 'react';
import {
  StyleSheet,
  Image
} from 'react-native';
import styles from './styles'

import { Container, Content, List, ListItem, Text } from 'native-base';



const routes = ["Home", "Catalog", "Connect", "Map", "FAQ", "Settings"];
export default class SideBar extends React.Component {
  render() {
    return (
      <Container>
        <Content style={styles.contentContainer}>
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
