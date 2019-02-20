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
import HomeStack from './HomeStack'
import VideoStack from './VideoStack'



const TAB_BAR_OFFSET = -60;

class TabBarComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offset: new Animated.Value(0),
    };
  }

  componentWillReceiveProps(props) {
    const oldState = this.props.navigation.state;
    const oldRoute = oldState.routes[oldState.index];
    const oldParams = oldRoute.routes[oldRoute.index].params;
    const wasVisible = !oldParams || oldParams.visible;

    const newState = props.navigation.state;
    const newRoute = newState.routes[newState.index];
    const newParams = newRoute.routes[newRoute.index].params;
    const isVisible = !newParams || newParams.visible;

    if (wasVisible && !isVisible) {
      Animated.timing(this.state.offset, { toValue: TAB_BAR_OFFSET, duration: 500 }).start();
    } else if (isVisible && !wasVisible) {
      Animated.timing(this.state.offset, { toValue: 0, duration: 500 }).start();
    }
  }

  render() {
    return (
        <BottomTabBar {...this.props} style={[styles.container, { bottom: this.state.offset }]}/>
    );
  }
}

const styles = {
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    height: 55,
    elevation: 8,
  },
};


export default createBottomTabNavigator({
    Home: {
        screen: HomeStack,
    },
    MultiBar: {
        screen: () => null,
        navigationOptions: ({navigation}) => ({
            tabBarIcon: () => (
                <CustomTabBarBottom />
            )
        }),
        params: {
            navigationDisabled: true
        }
    },
    Video: {
        screen: VideoStack,
    }

}, {
  tabBarComponent: props =>
    <TabBarComponent
      {...props}
    />,
    tabBarOptions: {
    showLabel: false,

  },

}
);
