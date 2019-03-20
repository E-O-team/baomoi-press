import React, { Component } from 'react';
import {createMaterialTopTabNavigator} from 'react-navigation';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import OtherCategoriesScreens from '../screens/HomeScreen/OtherCategoriesScreens';
import {ThemeContext, Provider, Consumer} from '../context/context.js';
import Header from '../components/Header.js';
import {
    StyleSheet,
} from 'react-native';
export default createMaterialTopTabNavigator({
    Home: {
        screen: HomeScreen,
        navigationOptions:{
            tabBarLabel: "Trang chủ",
        }
    },
    BeautyScreen: {
        screen: OtherCategoriesScreens,
        navigationOptions:{
            tabBarLabel: "Đẹp",
        },
        params: {
            categories: [
                {
                    name: "Thời trang",
                    id: 144,
                },
                {
                    name: "Làm đẹp",
                    id: 143,
                },
            ]
        }
    },
    BusinessScreen: {
        screen: OtherCategoriesScreens,
        navigationOptions:{
            tabBarLabel: "Kinh doanh",
        },
        params: {
            categories: [
                {
                    name: "Thị trường",
                    id: 170,
                },
                {
                    name: "Tài chính",
                    id: 169,
                },
                {
                    name: "Doanh nhân",
                    id: 168,
                },
                {
                    name: "Bất động sản",
                    id: 167,
                },
            ]
        }
    },
    CarsScreen: {
        screen: OtherCategoriesScreens,
        navigationOptions:{
            tabBarLabel: "Xe",
        },
        params: {
            categories: [
                {
                    name: "Ô tô",
                    id: 196,
                },
                {
                    name: "Xe độ",
                    id: 197,
                },
                {
                    name: "Xe máy",
                    id: 198,
                },
            ]
        }
    },
    DecodeScreen: {
        screen: OtherCategoriesScreens,
        navigationOptions:{
            tabBarLabel: "Giải mã",
        },
        params: {
            categories: [
                {
                    name: "Phong thuỷ",
                    id: 154,
                },
                {
                    name: "Tướng số",
                    id: 157,
                },
                // {
                //     name: "Tử vi",
                //     id: 156,
                // },
                {
                    name: "Giải mã giấc mơ",
                    id: 153,
                },
                {
                    name: "Phong tục tập quán",
                    id: 155,
                },
            ]
        }
    },
    EntertainmentScreen: {
        screen: OtherCategoriesScreens,
        navigationOptions:{
            tabBarLabel: "Gỉải trí",
        },
        params: {
            categories: [
                {
                    name: "Âm nhạc",
                    id: 158,
                },
                {
                    name: "Điện ảnh",
                    id: 159,
                },
                {
                    name: "Ngắm sao",
                    id: 15,
                },
                {
                    name: "Scandal",
                    id: 160,
                },
                {
                    name: "Showbiz",
                    id: 161,
                },
            ]
        }
    },
    HacksScreen: {
        screen: OtherCategoriesScreens,
        navigationOptions:{
            tabBarLabel: "Mách bạn",
        },
        params: {
            categories: [
                // {
                //     name: "Mẹo vặt",
                //     id: 174,
                // },
                // {
                //     name: "Nhà đẹp",
                //     id: 175,
                // },
                {
                    name: "Cưới hỏi",
                    id: 173,
                },
                // {
                //     name: "Ăn ngon - Khéo tay",
                //     id: 172,
                // },
            ]
        }
    },
    HealthScreen: {
        screen: OtherCategoriesScreens,
        navigationOptions:{
            tabBarLabel: "Sức khoẻ",
        },
        params: {
            categories: [
                {
                    name: "Mẹ và bé",
                    id: 184,
                },
                {
                    name: "Bài thuốc hay",
                    id: 182,
                },
                {
                    name: "Ăn gì - Uống gì",
                    id: 181,
                },
                {
                    name: "Hỏi đáp sức khoẻ",
                    id: 183,
                },
                // {
                //     name: "Phòng chữ bệnh",
                //     id: 185,
                // },
            ]
        }
    },
    InternetScreen: {
        screen: OtherCategoriesScreens,
        navigationOptions:{
            tabBarLabel: "Cư dân mạng",
        },
        params: {
            categories: [
                {
                    name: "Đang HOT",
                    id: 120,
                },
                {
                    name: "Hot girl - Nữ Sinh",
                    id: 26,
                },
            ]
        }
    },
    LawsScreen: {
        screen: OtherCategoriesScreens,
        navigationOptions:{
            tabBarLabel: "Pháp luật",
        },
        params: {
            categories: [
                {
                    name: "An ninh trật tự",
                    id: 178,
                },
                {
                    name: "Tư vấn pháp luật",
                    id: 179,
                },
            ]
        }
    },
    NewsScreen: {
        screen: OtherCategoriesScreens,
        navigationOptions:{
            tabBarLabel: "Thời sự",
        },
        params: {
            categories: [
                {
                    name: "Xã hội",
                    id: 108,
                },
                {
                    name: "Giao thông",
                    id: 192,
                },
                {
                    name: "Y tế - Giáo dục",
                    id: 193,
                },
            ]
        }
    },
    SportScreen: {
        screen: OtherCategoriesScreens,
        navigationOptions:{
            tabBarLabel: "Thể thao",
        },
        params: {
            categories: [
                {
                    name: "Bóng đá",
                    id: 190,
                },
                {
                    name: "Môn khác",
                    id: 191,
                },
                {
                    name: "Hậu trường",
                    id: 113,
                },
            ]
        }
    },
    TalksScreen: {
        screen: OtherCategoriesScreens,
        navigationOptions:{
            tabBarLabel: "Buôn dưa lê",
        },
        params: {
            categories: [
                {
                    name: "Công sở",
                    id: 126,
                },
                // {
                //     name: "Đang yêu",
                //     id: 127,
                // },
                {
                    name: "Giới tính",
                    id: 128,
                },
                {
                    name: "Ngoại tình",
                    id: 130,
                },
                {
                    name: "Hôn nhân - Gia đình",
                    id: 129,
                },
            ]
        }
    },
    TechnologyScreen: {
        screen: OtherCategoriesScreens,
        navigationOptions:{
            tabBarLabel: "Công nghệ",
        },
        params: {
            categories: [
                {
                    name: "Mách nhỏ",
                    id: 131,
                },
                {
                    name: "Tin tức số",
                    id: 133,
                },
                {
                    name: "Review công nghệ",
                    id: 132,
                },
            ]
        }
    },
    TravelScreen: {
        screen: OtherCategoriesScreens,
        navigationOptions:{
            tabBarLabel: "Du lịch",
        },
        params: {
            categories: [
                {
                    name: "Ăn gì - ở đâu",
                    id: 139,
                },
                {
                    name: "Cẩm nang du lịch",
                    id: 140,
                },
                {
                    name: "Địa điểm du lịch",
                    id: 132,
                },
            ]
        }
    },
    WorldScreen: {
        screen: OtherCategoriesScreens,
        navigationOptions:{
            tabBarLabel: "Thế giới",
        },
        params: {
            categories: [
                {
                    name: "Hồ sơ",
                    id: 187,
                },
                {
                    name: "Quân sự",
                    id: 188,
                },
                {
                    name: "Tin tức thế giới",
                    id: 189,
                },
            ]
        }
    },
},{
    order: [
        "Home",
        "NewsScreen",
        "WorldScreen",
        "LawsScreen",
        "InternetScreen",
        "TechnologyScreen",
        "TravelScreen",
        "BeautyScreen",
        "EntertainmentScreen",
        "BusinessScreen",
        "HacksScreen",
        "HealthScreen",
        "SportScreen",
        "CarsScreen",
        "TalksScreen",
        "DecodeScreen",
    ],
    lazy: true,
    tabBarOptions: {
        scrollEnabled: true,
        activeTintColor: "red",
        inactiveTintColor: "black",
        style: {
            backgroundColor: "white",
        },
        indicatorStyle: {
            backgroundColor: "red",
        },
        labelStyle: {
            fontSize: 12,
        },
        tabStyle:{
            width: 95,
            height: 40,
            padding: 0
        }
    },
}
)
