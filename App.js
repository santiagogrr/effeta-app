import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { StyleSheet, Text, View } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import HomeScreen from './src/screens/HomeScreen';
import RewardScreen from './src/screens/RewardScreen';
import TaskScreen from './src/screens/TaskScreen';
import AddRewardScreen from './src/screens/AddRewardScreen';
import SelectTaskScreen from './src/screens/SelectTaskScreen';
import AssignTaskScreen from './src/screens/AssignTaskScreen';
import EditTaskScreen from './src/screens/EditTaskScreen';
import ConfirmTasksScreen from './src/screens/ConfirmTasksScreen';
import ConfirmRewardsScreen from './src/screens/ConfirmRewardsScreen';
import EditRewardScreen from './src/screens/EditRewardScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import OtherScreen from './src/screens/OtherScreen';
import ParentalControlScreen from './src/screens/ParentalControlScreen';
import AuthLoadingScreen from './src/screens/AuthLoadingScreen';
import Ionicons from 'react-native-vector-icons/FontAwesome5';

// const BottomTabAppStack = createBottomTabNavigator(
//   { Home: HomeScreen, Other: OtherScreen }
//   );

const HomeStack = createStackNavigator({
  Home: HomeScreen, Task: TaskScreen, ConfirmTasks: ConfirmTasksScreen, ConfirmRewards: ConfirmRewardsScreen
});

const OtherStack = createStackNavigator({
  Other: OtherScreen,
});

const ParentalControlStack = createStackNavigator({
  ParentalControl: ParentalControlScreen, SelectTask: SelectTaskScreen, AssignTask: AssignTaskScreen, EditTask: EditTaskScreen, EditReward: EditRewardScreen
});

const RewardStack = createStackNavigator({
  Reward: RewardScreen, AddReward: AddRewardScreen
});

const ProfileStack = createStackNavigator({
  Profile: ProfileScreen,
});

const AppStack = createBottomTabNavigator({ 
  Home: HomeStack,
  Reward: RewardStack,
  Control: ParentalControlStack,
  //Other: OtherStack,
  Profile: ProfileStack
}, {
  defaultNavigationOptions:({navigation})=>({
    tabBarIcon: ({ focused, horizontal, tintColor }) => {
      const { routeName } = navigation.state;
      let Icon= Ionicons;
      let iconName;

      if(routeName === 'Home'){
          iconName = `home`;
      }

      if(routeName === 'Reward'){
          iconName = `gift`;
      }

      if(routeName === 'Control'){
        iconName = `user-check`;
    }

      if(routeName === 'Profile'){
        iconName = `user-alt`;
    }

      return <Icon name={iconName} size={25} color={tintColor} />;
  },
  // tabBarOptions: {
  //   activeTintColor: 'tomato',
  //   inactiveTintColor: 'gray',
  // },

  })
}
);
const AuthStack = createStackNavigator({ Login: LoginScreen, SignUp: SignUpScreen });

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