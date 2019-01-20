import React, { Component } from 'react';
import { Platform, Text, View, Image, Animated } from 'react-native';
import { createStackNavigator} from 'react-navigation';
import {createBottomTabNavigator, BottomTabBar} from 'react-navigation-tabs';
import ArticleScreen from '../screens/ArticleScreen';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import ListCategories from '../screens/ListCategories';
import SettingsScreen from '../screens/SettingsScreen';
import OriginalWebView from '../screens/OriginalWebView';
import SearchScreen from '../screens/SearchScreen';
import {MultiBar, MultiBarToggle} from 'react-native-multibar';
import {Icon} from 'react-native-elements';


const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Article: ArticleScreen,
  OriginalUrl: OriginalWebView,
  Search: SearchScreen
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <Text style={{color:'white'}}>Home</Text>
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
    <Text style={{color:'white'}}>Settings</Text>
  ),
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
                <MultiBarToggle
                    navigation={navigation}
                    actionSize={30}
                    routes={[
                        {
                            routeName: 'Home',
                            color: '#FF8360',
                            icon: (
                                <Icon
                                    name="fiber-new"
                                    color="#333333"
                                    size={20}
                                />
                            )
                        },
                        {
                            routeName: 'Home',
                            color: '#E8E288',
                            icon: (
                                <Icon
                                    name="credit-card"
                                    color="#333333"
                                    size={20}
                                />
                            )
                        },
                        {
                            routeName: 'Home',
                            color: '#7DCE82',
                            icon: (
                                <Icon
                                    name="share"
                                    color="#333333"
                                    size={20}
                                />
                            )
                        },
                    ]}
                    icon={(
                      <Image
                      source={{uri: "https://baomoi.press/wp-content/uploads/2017/08/logo.png"}}
                      style={{ width: 70, height: 70, resizeMode:'contain'}}
                      />
                    )}
                />
            )
        }),
        params: {
            navigationDisabled: true
        }
    },Setting: SettingsStack

}, {
  tabBarComponent: props =>
    <TabBarComponent
      {...props}
    />,
    tabBarOptions: {
        showLabel: false,
        activeTintColor: '#FF3333',
        inactiveTintColor: '#586589',
    }
});
