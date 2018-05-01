import React from 'react';
import { View, Image, FlatList, ImageBackground } from 'react-native';
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
        <Header style={{ backgroundColor: 'lightblue' }} >
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("DrawerOpen")}>
                <Icon name="menu" style={{ color: "rgb(58, 132, 173)" }} />
              </Button>
          </Left>
          <Body>
            <Title>
              Map
            </Title>
          </Body>
          <Right />
        </Header>
          <Content padder style={{ backgroundColor: 'black', paddingTop: 100, }} >
            {/* <Image source={require('../../../Images/Map.png')} style={{ minHeight: 300, minWidth: 200, maxWidth: 400, maxHeight: 600 }} /> */}
          </Content>
        </Container>
    );
  }
}
