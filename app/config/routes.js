import React from 'react';
import { AsyncStorage } from 'react-native';
import { DrawerNavigator, StackNavigator, SwitchNavigator } from 'react-navigation';

import AuthLoading from '../screens/AuthLoading';
import Catalog  from '../screens/Catalog';
import Connect  from '../screens/Connect';
import FAQ  from '../screens/FAQ';
import Home  from '../screens/Home';
import MapScreen  from '../screens/Map';
import Sidebar  from '../components/Sidebar';
import Auth  from '../screens/Auth';
import Settings  from '../screens/Settings';
import Report  from '../screens/Report';





const HomeDrawerNavigator = DrawerNavigator(
  {
    Home: {
      screen: Home
    },
    Catalog: {
      screen: Catalog
    },
    Connect: {
      screen: Connect
    },
    Map: {
      screen: MapScreen
    },
    FAQ: {
      screen: FAQ
    },
    Settings: {
      screen: Settings
    },
    Report: {
      screen: Report
    },
  },
  {
    headerMode: 'none',
    initialRouteName: "Home",
    contentComponent: props => <Sidebar {...props} />
  }
);


const AuthStack = StackNavigator(
  {
    Auth: {
      screen: Auth
    }
  },
  {
    headerMode: 'none'
  }
);



// DrawNav = StackNavigator(
//   {
//     Settings: {
//       screen: Settings
//     },
//   },
//   {
//     initialRouteName: "Settings"
//   }
// );
//
//
//
// DrawNav = StackNavigator(
//   {
//     Catalog: {
//       screen: Catalog
//     },
//   },
//   {
//     headerMode: 'none',
//     initialRouteName: "Catalog"
//   }
// );

export default InitialSwitch = SwitchNavigator(
  {
    AuthLoading: AuthLoading,
    App: HomeDrawerNavigator,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
    headerMode: 'none'
  }
)
