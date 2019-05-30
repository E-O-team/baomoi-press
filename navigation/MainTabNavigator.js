import React, { Component } from 'react';
import { Platform, Text, View, Image, Animated, StyleSheet, Dimensions, TouchableOpacity, Easing, Share } from 'react-native';
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
import { Ionicons  } from '@expo/vector-icons';
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
import InviteScreen from '../screens/InviteScreen';

var { width, height } = Dimensions.get('window');
const baomoi_app_url = 'https://play.google.com/store/apps/details?id=com.press.baomoi'

const HomeStack = createStackNavigator({
  Home: {
      screen: HomeTabNavigator,
      navigationOptions: ({ navigation }) => ({
        header: <Header navigation={navigation} shouldHaveDivider={false}/>,
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
  Invite: InviteScreen,
  Source: SourceScreen,
  Terms: TermsScreen,
  ExchangeHistory: ExchangeHistoryScreen,
  WebView: OriginalWebView,

},{
    headerMode: "float",
    transitionConfig: () => ({
     transitionSpec: {
       duration: 0,
       timing: Animated.timing,
     },
   }),
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
        header: <Header navigation={navigation} shouldHaveDivider={true}/>,
      }),
  },
  Article: ArticleScreen,
  OriginalUrl: OriginalWebView,
  Search: SearchScreen,
  Settings: SettingsScreen,
  UserProfile: UserProfile,
  UserProfileEdit: UserProfileEdit,
},{
    transitionConfig: () => ({
     transitionSpec: {
       duration: 0,
       timing: Animated.timing,
     },
   }),
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
    _isClickedHomeBtn = false
  constructor(props) {
    super(props);
    this.state = {
      offset: new Animated.Value(0),
      animating: false,
      left: new Animated.Value(width/2),
      bottom: new Animated.Value(30),
      bottomCenter: new Animated.Value(30),
    };
  }

  componentWillReceiveProps(props) {
    const oldState = this.props.navigation.state;


    const oldRoute = oldState.routes[oldState.index];
    var oldParams = oldRoute.routes[oldRoute.index].params;
    if(oldState.index === 0)
    {
    const oldRouteChild = oldRoute.routes[oldRoute.index]
    oldParams = oldRouteChild.routes[oldRouteChild.index].params;
    }
    const wasVisible = !oldParams || oldParams.visible;


    const newState = props.navigation.state;
    const newRoute = newState.routes[newState.index];
    var newParams = newRoute.routes[newRoute.index].params;
    if(newState.index === 0)
    {
    const newRouteChild = newRoute.routes[newRoute.index]
    newParams = newRouteChild.routes[newRouteChild.index].params;
    }
    const isVisible = !newParams || newParams.visible;

    if (wasVisible && !isVisible) {
      Animated.timing(this.state.offset, { toValue: TAB_BAR_OFFSET, duration: 500 }).start();

    } else if (isVisible && !wasVisible) {
      Animated.timing(this.state.offset, { toValue: 0, duration: 500 }).start();

    }

    this._isClickedHomeBtn = newState.routes[1].params.onClickBtn;
    if(this._isClickedHomeBtn) this.animating()
  }

  animating = () => {

    this.setState({
      left:  new Animated.Value(width/2),
      bottom: new Animated.Value(30),
      bottomCenter:new Animated.Value(30)})


    setTimeout(() => {
      Animated.timing(this.state.left, {
        toValue: width/2 + 100,
        duration: 300,
        easing: Easing.linear,
      }).start();

      Animated.timing(this.state.bottom, {
        toValue: 130,
        duration: 300,
        easing: Easing.linear,
      }).start();
      Animated.timing(this.state.bottomCenter, {
        toValue: 230,
        duration: 300,
        easing: Easing.linear,
      }).start();


    }, 100)

  }

  onShareApp = () => {
      Share.share({
        ...Platform.select({
          ios: {
            message: 'Have a look on : ',
            url: baomoi_app_url,
          },
          android: {
            message: 'Have a look on : \n' + baomoi_app_url
          }
        }),
        title: 'Wow, did you see that?'
      }, {
        ...Platform.select({
          ios: {
            // iOS only:
            excludedActivityTypes: [
              'com.apple.UIKit.activity.PostToTwitter'
            ]
          },
          android: {
            // Android only:
            dialogTitle: 'Share : ' + baomoi_app_url
          }
        })
      });
  }

  render() {
    const blackScreen = (this._isClickedHomeBtn) ? <View style={styles.overlayscreen}></View> : <View></View>
    const expandedView = (this._isClickedHomeBtn) ?
                                    <View>
                                        <Animated.View style={{     right:this.state.left,
                                                                     bottom:this.state.bottom,
                                                                     position:'absolute',
                                                                     zIndex: 1001
                                                                    }}>
                                          <TouchableOpacity onPress={()=> this.props.navigation.navigate('Home') } style={{alignItems: 'center', width: 60, height: 60, borderRadius:60/2}}>
                                            <View style={styles.IconView}>
                                              <Ionicons name={"ios-paper"} size={20} color={"#fff"} style={styles.buttonIcon}  />
                                            </View>
                                            <Text style={styles.iconText}>News</Text>
                                          </TouchableOpacity>

                                        </Animated.View>

                                        <Animated.View style={{left:this.state.left,
                                                               bottom:this.state.bottom,
                                                               position:'absolute',
                                                               zIndex: 1001
                                                               }}>
                                           <TouchableOpacity onPress={this.onShareApp} style={{alignItems: 'center', width: 60, height: 60, borderRadius:60/2}}>
                                             <View style={styles.IconView}>
                                               <Ionicons name={"ios-share"} size={20} color={"#fff"} style={styles.buttonIcon}  />
                                             </View>
                                             <Text style={styles.iconText}>Share</Text>
                                           </TouchableOpacity>
                                        </Animated.View>

                                        <Animated.View style={{
                                                                   bottom:this.state.bottomCenter,
                                                                   left: width/2-30,
                                                                    position:'absolute',
                                                                    zIndex: 1001,

                                                                    }}>
                                          <TouchableOpacity onPress={()=> this.props.navigation.openDrawer()} style={{alignItems: 'center',width: 60, height: 60, borderRadius:60/2}}>
                                            <View style={styles.IconView}>
                                                <Icon
                                              name='credit-card'
                                              color='#fff'
                                              size={20}
                                              style={styles.buttonIcon}
                                               />
                                            </View>
                                            <Text style={styles.iconText}>Xu</Text>
                                          </TouchableOpacity>
                                        </Animated.View>
                                </View> : <View></View>
    return (
        <View>
            {blackScreen}
            {expandedView}
            <BottomTabBar {...this.props} style={[styles.container, { bottom: this.state.offset }]}/>
        </View>
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
    zIndex: 1000
  },
  overlayscreen:{
    backgroundColor:'black',
    opacity: 0.5,
    width: width,
    height:height-70,
    right: 0,
    bottom: 0,
    justifyContent:'center',
    zIndex:999,
    position:'absolute'
},
    buttonIcon: {
      textAlign: "center",
    },
    IconView:{
      backgroundColor:'#CC0000',
       width: 40,
       height:40,
       borderRadius: 40/2,
       justifyContent:'center',

    },
    iconText: {
      fontSize: 12,
      color: '#fff',
      fontWeight: 'bold',
    }
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
