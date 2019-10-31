import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { StyleSheet, Text, View } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import OtherScreen from './src/screens/OtherScreen';
import AuthLoadingScreen from './src/screens/AuthLoadingScreen';
import Ionicons from 'react-native-vector-icons/FontAwesome';

// const BottomTabAppStack = createBottomTabNavigator(
//   { Home: HomeScreen, Other: OtherScreen }
//   );

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

const OtherStack = createStackNavigator({
  Other: OtherScreen,
});

const AppStack = createBottomTabNavigator({ 
  Home: HomeStack, 
  Other: OtherStack 
}, {
  defaultNavigationOptions:({navigation})=>({
    tabBarIcon: ({ focused, horizontal, tintColor }) => {
      const { routeName } = navigation.state;
      let Icon= Ionicons;
      let iconName;

      if(routeName === 'Home'){
          iconName = `home`;
      }

      if(routeName === 'Other'){
          iconName = `rocket`;
      }

      return <Icon name={iconName} size={25} color={tintColor} />;
  },
  tabBarOptions: {
    activeTintColor: 'tomato',
    inactiveTintColor: 'gray',
  },

  })
}
);
const AuthStack = createStackNavigator({ Login: LoginScreen });

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AuthLoading',
    }
  )
);