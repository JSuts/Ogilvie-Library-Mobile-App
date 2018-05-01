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

// import Sidebar from './sidebar.js';
// import styles from '../styles.js';


export default class Settings extends React.Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
    }
  }



  render() {
    return (
      <Container>

      </Container>
    );
  }
}
