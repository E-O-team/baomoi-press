import React, { Component } from 'react';
import {createMaterialTopTabNavigator} from 'react-navigation';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import BeautyScreen from '../screens/HomeScreen/Beauty';
import BusinessScreen from '../screens/HomeScreen/Business';
import CarsScreen from '../screens/HomeScreen/Cars';
import DecodeScreen from '../screens/HomeScreen/Decode';
import EntertainmentScreen from '../screens/HomeScreen/Entertainment';
import HacksScreen from '../screens/HomeScreen/Hacks';
import HealthScreen from '../screens/HomeScreen/Health';
import InternetScreen from '../screens/HomeScreen/Internet';
import LawsScreen from '../screens/HomeScreen/Laws';
import NewsScreen from '../screens/HomeScreen/News';
import SportScreen from '../screens/HomeScreen/Sport';
import TalksScreen from '../screens/HomeScreen/Talks';
import TechnologyScreen from '../screens/HomeScreen/Technology';
import TravelScreen from '../screens/HomeScreen/Travel';
import WorldScreen from '../screens/HomeScreen/World';
import Header from '../components/Header.js';

export default createMaterialTopTabNavigator({
    Home: {
        screen: HomeScreen,
        navigationOptions:{
            tabBarLabel: "Trang chủ",
        }
    },
    BeautyScreen: {
        screen: BeautyScreen,
        navigationOptions:{
            tabBarLabel: "Đẹp",
        }
    },
    BusinessScreen: {
        screen: BusinessScreen,
        navigationOptions:{
            tabBarLabel: "Kinh doanh",
        }
    },
    CarsScreen: {
        screen: CarsScreen,
        navigationOptions:{
            tabBarLabel: "Xe",
        }
    },
    DecodeScreen: {
        screen: DecodeScreen,
        navigationOptions:{
            tabBarLabel: "Gỉải mã",
        }
    },
    EntertainmentScreen: {
        screen: EntertainmentScreen,
        navigationOptions:{
            tabBarLabel: "Gỉải trí",
        }
    },
    HacksScreen: {
        screen: HacksScreen,
        navigationOptions:{
            tabBarLabel: "Mách bạn",
        }
    },
    HealthScreen: {
        screen: HealthScreen,
        navigationOptions:{
            tabBarLabel: "Sức khoẻ",
        }
    },
    InternetScreen: {
        screen: InternetScreen,
        navigationOptions:{
            tabBarLabel: "Cư dân mạng",
        }
    },
    LawsScreen: {
        screen: LawsScreen,
        navigationOptions:{
            tabBarLabel: "Pháp luật",
        }
    },
    NewsScreen: {
        screen: NewsScreen,
        navigationOptions:{
            tabBarLabel: "Ăn gì - ở đâu",
        }
    },
    SportScreen: {
        screen: SportScreen,
        navigationOptions:{
            tabBarLabel: "Thể thao",
        }
    },
    TalksScreen: {
        screen: TalksScreen,
        navigationOptions:{
            tabBarLabel: "Buôn dưa lê",
        }
    },
    TechnologyScreen: {
        screen: TechnologyScreen,
        navigationOptions:{
            tabBarLabel: "Công nghệ",
        }
    },
    TravelScreen: {
        screen: TravelScreen,
        navigationOptions:{
            tabBarLabel: "Du lịch",
        }
    },
    WorldScreen: {
        screen: WorldScreen,
        navigationOptions:{
            tabBarLabel: "Thế giới",
        }
    },
    // Craft: {
    //     screen: HomeScreen,
    //     navigationOptions:{
    //         tabBarLabel: "Khéo tay",
    //     }
    // },
    // Security: {
    //     screen: HomeScreen,
    //     navigationOptions:{
    //         tabBarLabel: "An ninh trật tự",
    //     }
    // },
    // Mystery: {
    //     screen: HomeScreen,
    //     navigationOptions:{
    //         tabBarLabel: "Bí Ẩn",
    //     }
    // },
    // Hot: {
    //     screen: HomeScreen,
    //     navigationOptions:{
    //         tabBarLabel: "Ảnh Nóng",
    //     }
    // }
},{
    lazy: true,
    tabBarOptions: {
     scrollEnabled: true,
   },
}
)
