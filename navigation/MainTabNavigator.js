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
import Header from '../components/Header.js';
import FollowingScreen from '../screens/FollowingScreen';
import SourceScreen from '../screens/SourceScreen';
import NotificationScreen from '../screens/NotificationScreen';
import TermsScreen from '../screens/TermsScreen';
import ExchangeGiftsScreen from '../screens/ExchangeGiftsScreen';
import ExchangeHistoryScreen from '../screens/ExchangeHistoryScreen';
import NotificationsDetail from '../screens/NotificationsDetail';

const HomeStack = createStackNavigator({
  Home: {
      screen: HomeTabNavigator,
      navigationOptions: ({ navigation }) => ({
        header: <Header navigation={navigation}/>,
      }),
  },
  Article: ArticleScreen,
  OriginalUrl: OriginalWebView,
  Search: SearchScreen,
  Settings: SettingsScreen,
  SignIn: SignInScreen,
  UserProfile: UserProfile,
  UserProfileEdit: UserProfileEdit,
  Following: FollowingScreen,
  Notifications: NotificationScreen,
  NotificationsDetail: NotificationsDetail,
  ExchangeGifts: ExchangeGiftsScreen,
  Source: SourceScreen,
  Terms: TermsScreen,
  ExchangeHistory: ExchangeHistoryScreen,
  WebView: OriginalWebView,

},{
    headerMode: "float"
});
const highlightTab = (tabName, focused) => {

};
HomeStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarLabel: 'Home',
    tabBarIcon: ({ focused }) => {
      var footerHeight;
      if (focused) {
        footerHeight = 1;
        opacity = 1;
      } else {
        footerHeight = 0;
        opacity = 0.7;
      }

      var styles = StyleSheet.create({
        tab: {
          flexGrow: 1,
          alignItems: 'stretch',
          justifyContent: 'center'
        },
        labelFooter: {
          height: footerHeight,
          backgroundColor: 'red'
        }
      });
      return (
        <View style={styles.tab}>
          <Text style={{color: 'white', opacity: opacity, fontSize: 20, fontWeight: "bold"}}>Home</Text>
          <View style={styles.labelFooter}/>
        </View>
      );
    },
    tabBarVisible
  }
};

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
      var footerHeight, opacity;

      if (focused ) {
        footerHeight = 1;
        opacity = 1;
      } else {
        footerHeight = 0;
        opacity = 0.7;
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
          <Text style={{color: 'white', opacity: opacity, fontSize: 20, fontWeight: "bold"}}>Video</Text>
          <View style={styles.labelFooter}/>
        </View>
    )
    },
    tabBarVisible
  }
};



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
    console.log("in!")
    const oldRoute = oldState.routes[oldState.index];
    var oldParams = oldRoute.routes[oldRoute.index].params;
    if(oldState.index === 0)
    {
    const oldRouteChild = oldRoute.routes[oldRoute.index]
    oldParams = oldRouteChild.routes[oldRouteChild.index].params;
    }
    const wasVisible = !oldParams || oldParams.visible;
    console.log(wasVisible)


    const newState = props.navigation.state;
    const newRoute = newState.routes[newState.index];
    var newParams = newRoute.routes[newRoute.index].params;
    if(newState.index === 0)
    {
    const newRouteChild = newRoute.routes[newRoute.index]
    newParams = newRouteChild.routes[newRouteChild.index].params;
    }
    const isVisible = !newParams || newParams.visible;
    console.log(isVisible)

    if (wasVisible && !isVisible) {
      Animated.timing(this.state.offset, { toValue: TAB_BAR_OFFSET, duration: 1000 }).start();
    } else if (isVisible && !wasVisible) {
      Animated.timing(this.state.offset, { toValue: 0, duration: 1000 }).start();
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
    height: 50,
    elevation: 8,
  },
};
//const TabBarComponent = (props) => (<BottomTabBar {...props} />);


export default createBottomTabNavigator({
    Home: HomeStack,
    MultiBar: {
        screen: () => null,
        navigationOptions: ({navigation}) => ({
            tabBarIcon: () => (
                <CustomTabBarBottom navigation={navigation}/>
            )
        }),
        params: {
            navigationDisabled: true
        }
    }, Video: VideoStack

}, {
  tabBarComponent: props =>
    <TabBarComponent
      {...props}
    />,
    tabBarOptions: {
    showLabel: false,

  },

});
