import React from 'react';
import { View, Image, FlatList, ImageBackground, ScrollView } from 'react-native';
import {
  Container,
  Icon,
  Drawer,
  Button,
  Header,
  Left,
  Body,
  Title,
  Text,
  Right,
  Content,
  Form,
  Item,
  Input,
  List,
  ListItem,
  Thumbnail,
  Footer,
  FooterTab,
} from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
// import { signInAction } from "../../actions/actions.js"
// import { store } from "../../store/store.js"
// import { HomeScreen } from "../HomeScreen/index.js"
// import md5 from 'md5';

// import Sidebar from './sidebar.js';
// import styles from '../styles.js';


export default class Map extends React.Component {
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
            <Icon style={{fontSize: 15}} type="FontAwesome" name="map" />
            <Title style={{color: '#F7F7F2'}}>Map</Title>
          </Body>
          <Right />
        </Header>

          <ScrollView maximumZoomScale={3} minimumZoomScale={1} style={{ flex: 1, alignSelf: 'center', backgroundColor: '#261C15', paddingTop: 100 }} >
              <Image source={require('../../assets/Map.png')} resizeMode='contain' />
          </ScrollView>

        </Container>
    );
  }
}
