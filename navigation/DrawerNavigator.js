import {createDrawerNavigator} from 'react-navigation';
import HomeTabNavigator from './HomeTabNavigator';
import SideBar from '../components/SideBar';
import MainTabNavigator from './MainTabNavigator';
import Header from '../components/Header.js';
export default createDrawerNavigator({
    Home: {
        screen: HomeTabNavigator,
    }
},{
    contentComponent: SideBar
})
