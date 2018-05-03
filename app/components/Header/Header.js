import React from 'react';
import { Body, Button, Header, Icon, Left, Right, Title } from 'native-base';
import styles from './styles';

/* Takes props:
  navigation=navigation
  title="String"
*/
const AppHeader = (props) => {
  return (
    <Header style={styles.headerStyle} iosBarStyle="dark-content">
      <Left>
        <Button
        transparent
        onPress={()=>this.props.navigation.navigate("DrawerOpen")}>
          <Icon name='menu' />
        </Button>
      </Left>
      <Body>
        <Title style={styles.textStyle}>
          {props.title}
        </Title>
      </Body>
      <Right />
    </Header>
  )
}

export default AppHeader;
