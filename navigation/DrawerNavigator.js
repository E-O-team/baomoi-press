import {createDrawerNavigator} from 'react-navigation';
import HomeTabNavigator from './HomeTabNavigator';
import SideBar from '../components/SideBar/SideBar';
import MainTabNavigator from './MainTabNavigator';
import Header from '../components/Header.js';
import { Dimensions } from 'react-native';
const {width} = Dimensions.get("window")
export default createDrawerNavigator({
    Home: {
        screen: MainTabNavigator,
    }
},{
    contentComponent: SideBar,
    drawerWidth: width
})
