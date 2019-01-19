import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, TabNavigator } from 'react-navigation';
import ArticleScreen from '../screens/ArticleScreen';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import ListCategories from '../screens/ListCategories';
import SettingsScreen from '../screens/SettingsScreen';
import OriginalWebView from '../screens/OriginalWebView';
import SearchScreen from '../screens/SearchScreen';
import CustomTabBarBottom from '../components/CustomTabBarBottom'

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Article: ArticleScreen,
  OriginalUrl: OriginalWebView,
  Search: SearchScreen
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};



const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  headerStyle:{
                backgroundColor: '#212121', // this will handle the cutOff at the top the screen
          },
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};


export default TabNavigator(
  {
  HomeStack,
  SettingsStack,
  },
  {
    navigationOptions: ({ navigation }) => {

      return {
        tabBarLabel: 'Demo',
        tabBarVisible: true,
      }
    },
    tabBarComponent: props => <CustomTabBarBottom {...props}/>,
    tabBarPosition: "bottom",

  }
  );
