import React, { Component } from 'react';
import { Platform, Text, View, Image, Animated, StyleSheet } from 'react-native';
import { createStackNavigator} from 'react-navigation';
import {createBottomTabNavigator, BottomTabBar} from 'react-navigation-tabs';
import ArticleScreen from '../screens/ArticleScreen';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import OriginalWebView from '../screens/OriginalWebView';
import SearchScreen from '../screens/SearchScreen';
import {MultiBar, MultiBarToggle} from 'react-native-multibar';
import {Icon} from 'react-native-elements';
import UserProfile from '../screens/UserProfileScreen';
import VideoScreen from '../screens/VideoScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import CustomTabBarBottom from '../components/CustomTabBarBottom'
import UserProfileEdit from '../screens/UserProfileEditScreen';
import HomeTabNavigator from './HomeTabNavigator';
import DrawerNavigator from './DrawerNavigator';
import Header from '../components/Header.js';

const VideoStack = createStackNavigator({
  Video: {
      screen: VideoScreen,
      navigationOptions: ({ navigation }) => ({
        header: <Header navigation={navigation}/>,
      }),
  },
  Article: ArticleScreen,
  OriginalUrl: OriginalWebView,
  Search: SearchScreen,
  Settings: SettingsScreen,
  UserProfile: UserProfile,
  UserProfileEdit: UserProfileEdit,
});


VideoStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarLabel: 'Video',
    tabBarIcon: ({ focused }) => {
      var footerHeight;
      if (focused) {
        footerHeight = 1;
      } else {
        footerHeight = 0;
      }

      var styles = StyleSheet.create({
        tab: {
          alignItems: 'stretch',
          justifyContent: 'center',
          flexGrow: 1,
        },
        labelFooter: {
          height: footerHeight,
          backgroundColor: 'red'
        }
      });
      return (
        <View style={styles.tab}>
          <Text style={{color: 'white', fontSize: 20, fontWeight: "bold"}}>Video</Text>
          <View style={styles.labelFooter}/>
        </View>
    )
    },
    tabBarVisible
  }
};


export default VideoStack
