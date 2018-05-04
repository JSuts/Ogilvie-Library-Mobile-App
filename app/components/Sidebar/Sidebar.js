import React, { Component } from 'react';
import {
  StyleSheet,
  Image
} from 'react-native';
import styles from './styles'

import { Container, Content, List, ListItem, Text, Icon, Thumbnail } from 'native-base';



const routes = ["Home", "Catalog", "Connect", "Map", "FAQ", "Settings"];
export default class SideBar extends React.Component {
  render() {
    return (
      <Container>
        <Content style={styles.contentContainer}>
          <List>
            <ListItem
              button
              onPress={() => {
                this.props.navigation.navigate("Home")}
              }>
              <Icon type="Entypo" name="home" />
              <Text>Home</Text>
            </ListItem>
          </List>
          <List>
            <ListItem
              button
              onPress={() => {
                this.props.navigation.navigate("Catalog")}
              }>
              <Icon type="Entypo" name="book" />
              <Text>Catalog</Text>
            </ListItem>
          </List>
          <List>
            <ListItem
              button
              onPress={() => {
                this.props.navigation.navigate("Connect")}
              }>
              <Thumbnail small square source={require('../../../assets/Twitter_Logo_Blue.png')} />
              <Text>Connect</Text>
            </ListItem>
          </List>
          <List>
            <ListItem
              button
              onPress={() => {
                this.props.navigation.navigate("Map")}
              }>
              <Icon type="FontAwesome" name="map" />
              <Text>Map</Text>
            </ListItem>
          </List>
          <List>
            <ListItem
              button
              onPress={() => {
                this.props.navigation.navigate("FAQ")}
              }>
              <Icon type="MaterialCommunityIcons" name="comment-question" />
              <Text>FAQ</Text>
            </ListItem>
          </List>
          <List>
            <ListItem
              button
              onPress={() => {
                this.props.navigation.navigate("Settings")}
              }>
              <Icon type="MaterialIcons" name="settings" />
              <Text>Settings</Text>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}
