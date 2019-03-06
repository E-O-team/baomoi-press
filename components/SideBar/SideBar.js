import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    SafeAreaView,
    ActivityIndicator,
    AsyncStorage,
} from 'react-native';
import {Consumer} from '../../context/context.js'
import { Avatar, Card, Icon, Button, Divider, Badge } from 'react-native-elements';
import axios from 'axios';
import MenuItemNoBadge from './MenuItemNoBadge';
import MenuItemWithBadge from './MenuItemWithBadge';
export default class SiderBar extends React.Component {
    constructor() {
        super()
        this.state={
            user: null,
        }
    }
    componentWillMount() {
        AsyncStorage.getItem('user')
        .then(res => {
            if(res){
                const user = JSON.parse(res)
                this.setState({
                    user: user,
                    token: user.token
                }, () => {
                    axios({
                        method: "GET",
                        url: "https://baomoi.press/wp-json/wp/v2/users/" + this.state.user.id,
                        headers: {'Authorization': 'Bearer ' + this.state.user.token},
                    })
                    .then((res) => this.setState({
                        user: res.data
                    }))
                    .catch(err => console.log(err))

                })
            }else{
                // this.props.navigation.navigate("Auth")
            }
        })
    }

    handleExchangeGiftsPress = () => {
        if(this.checkLogedIn()){
            this.props.navigation.navigate("ExchangeGifts", {
                xu: this.state.user.xu
            })
        }
    }

    handleNotificationPress = () => {
        if(this.checkLogedIn()){
            this.props.navigation.navigate("Notifications")
        }
    }

    handleSubscribedPressed = () => {
        if(this.checkLogedIn()){
            this.props.navigation.navigate("Following", {
                subscribed: this.state.user.subscribed,
            })
        }
    }

    handleNavigationPressed = (navigationDesination) => {
        if(navigationDesination == "Following"){
            this.handleSubscribedPressed()
        }else if (navigationDesination == "Notifications") {
            this.handleNotificationPress()
        }else if (navigationDesination == "ExchangeGifts") {
            this.handleExchangeGiftsPress()
        }
    }

    logOut = async () => {
        AsyncStorage.clear()
        this.props.navigation.navigate("AuthLoadingScreen")
    }

    checkLogedIn = () => {
        if(this.state.user !== null){
            return true
        }else{
            return false
        }
    }


    render(){
        const {user} = this.state
        TopNavigator = (props) => {
            const {name, type, color, content, navigationDesination, size} = props
            return(
                <TouchableOpacity
                    style={{flex: 1, alignItems: "center", justifyContent: "space-around"}}
                    onPress={() => {
                        this.handleNavigationPressed(navigationDesination)
                    }}
                >
                    <View style={{borderWidth: 1, borderColor: "black", borderRadius: 50, height: 45, width: 45, justifyContent:"center"}}>
                        <Icon
                            name={name}
                            type={type}
                            color={color}
                            size={size}
                        />
                    </View>
                    <Text style={{color: "#52607b"}}>{content}</Text>
                </TouchableOpacity>
            )
        }
        return(
            <Consumer>
                {({textColor, backGround}) => (
                    <View style={{backgroundColor: backGround, flex: 1, padding: 10}}>
                        <View style={{flexDirection: "row", backgroundColor: '#dd273e', marginHorizontal: -10, marginTop: -10, height: 120, alignItems: "flex-end", justifyContent: 'space-between', }}>
                            {user ? (
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate("UserProfile")}
                                    activeOpacity={0.5}
                                >
                                    <View style={{flexDirection: "row", paddingLeft: 5, paddingBottom: 5}}>
                                        <Avatar
                                            overlayContainerStyle={styles.avatar}
                                            medium
                                            rounded
                                            source={{uri: user.avatar_urls['96'] || defaultImg}}
                                        />
                                    <View style={{justifyContent: "center", alignItems: "flex-start"}}>
                                            <Text style={{color: "white", fontSize: 20,}}>{user.name}</Text>
                                            <Badge containerStyle={{ backgroundColor: "#dd273e", borderColor: "white", borderWidth: 1}}>
                                                <Text style={{color: "#f4d644"}}>{user.exp_rank.post.post_title}</Text>
                                            </Badge>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ) : (
                                <View style={{flexDirection: "row", alignItems: "center"}}>
                                    <Icon
                                        name='user'
                                        type='feather'
                                        reverse
                                        color="#a6122b"
                                    />
                                    <TouchableOpacity
                                        activeOpacity={0.5}
                                        onPress={() => this.props.navigation.navigate("Auth")}
                                    >
                                        <Text style={{color: "white", fontSize: 20}}>Đăng nhập</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            <View>
                                <View style={{alignSelf: "flex-end", marginBottom: 7}}>
                                    <Icon
                                        name='close'
                                        type='evilicon'
                                        size={30}
                                        color="white"
                                        onPress={() => this.props.navigation.closeDrawer()}
                                        underlayColor="#e12f28"
                                    />
                                </View>
                                <View style={{backgroundColor:"#3a5685", height: 40, width: 150, marginBottom: 5, alignItems: "center", borderTopLeftRadius: 60, borderBottomLeftRadius: 60, alignItems: "flex-start", paddingLeft: 15, justifyContent: "space-around" }}>
                                    <Text style={{color: "white"}}>MỜI BẠN, KHUI QUÀ</Text>
                                    {user ? (
                                        <View style={{flexDirection: "row", alignItems: "center"}}>
                                            <Icon
                                                type="material-community"
                                                name="coin"
                                                color="#49b253"
                                            />
                                            <Text style={{color: "white", marginLeft: 5}}>Xu: </Text>
                                            <Text style={{color: "#49b253"}}>{user.xu}</Text>
                                        </View>
                                    ) : (
                                        <View style={{flexDirection: "row", alignItems: "center"}}>
                                            <Icon
                                                type="material-community"
                                                name="coin"
                                                color="#49b253"
                                            />
                                            <Text style={{color: "white", marginLeft: 5}}>Xu: </Text>
                                            <Text style={{color: "#49b253"}}>0</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>
                        <ScrollView>
                            <View style={{padding: 10, paddingHorizontal: -5, flexDirection: "row"}}>
                                <TopNavigator name='ios-people' type='ionicon' color='#f37f58' size={40} content="Theo dõi" navigationDesination="Following"/>
                                <TopNavigator name='ios-notifications' type='ionicon' color='#abbaff' size={40} content="Thông báo" navigationDesination="Notifications"/>
                                <TopNavigator name='present' type='simple-line-icon' color='#ffcd57' size={32} content="Đổi quà" navigationDesination="ExchangeGifts" />
                            </View>
                            <Divider style={{ backgroundColor: '#e0e0e0', height: 1}} />
                            <View style={{marginTop: 10}}>
                                <View style={{flexDirection: "row"}}>
                                    <View style={{backgroundColor: "#fc5656", height: 18, width: 5}}></View>
                                    <Text style={{color: textColor, marginLeft: 10, fontSize: 18, fontWeight: "bold"}}>Nhiệm vụ kiếm xu</Text>
                                </View>
                                <MenuItemNoBadge name="smartphone" type="feather" color="#768cb1" content="Xem clip kiếm thêm xu" textColor={textColor} hot={false}/>
                                <MenuItemNoBadge name="medal" type="material-community" color="#f46c6c" content="Chia sẻ kiếm tiền" textColor={textColor} hot={true}/>
                            </View>
                            <View style={{marginTop: 25}}>
                                <View style={{flexDirection: "row"}}>
                                    <View style={{backgroundColor: "#fc5656", height: 18, width: 5}}></View>
                                    <Text style={{color: textColor, marginLeft: 10, fontSize: 18, fontWeight: "bold"}}>Nhiệm vụ hằng ngày</Text>
                                </View>
                                <MenuItemWithBadge name='comments-o' type='font-awesome' color='#f4d644' content="Bình luận được duyệt" textColor={textColor} exp="+1exp" backgroundColor={backGround}/>
                                <MenuItemWithBadge name='book' type='octicon' color='#f46c6c' content="Đọc bài báo 3 phút" textColor={textColor} exp="+1exp" backgroundColor={backGround}/>
                                <MenuItemWithBadge name='ios-people' type='ionicon' color='#f46c6c' content="Chia sẻ bài viết lên facebook" textColor={textColor} exp="+5Exp" backgroundColor={backGround}/>
                                <MenuItemWithBadge name='md-mail-open' type='ionicon' color='#ea5251' content="Mời bạn bè cài đặt app" textColor={textColor} exp="+10Exp" backgroundColor={backGround}/>
                            </View>
                            <View style={{marginTop: 25}}>
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate("Terms")}
                                >
                                    <View style={{ height: 50, justifyContent: "space-between"}}>
                                        <View></View>
                                        <Text style={{color: textColor, fontSize: 18}} >Điều khoản sử dụng</Text>
                                        <Divider style={{ backgroundColor: '#e0e0e0', height: 1}} />
                                    </View>
                                </TouchableOpacity>
                                <View style={{ height: 50, justifyContent: "space-between"}}>
                                    <View></View>
                                    <Text style={{color: textColor, fontSize: 18}} >Bình chọn báo mới</Text>
                                    <Divider style={{ backgroundColor: '#e0e0e0', height: 1}} />
                                </View>
                                <View style={{ height: 50, justifyContent: "space-between"}}>
                                    <View></View>
                                    <Text style={{color: textColor, fontSize: 18}} >Gửi email góp ý</Text>
                                    <Divider style={{ backgroundColor: '#e0e0e0', height: 1 }} />
                                </View>
                                {user &&
                                    <View style={{ height: 50, justifyContent: "space-between"}}>
                                        <View></View>
                                        <View opacity={0.3}><Text style={{color: textColor, fontSize: 18, }} onPress={this.logOut}>Đăng xuất</Text></View>
                                        <View></View>
                                    </View>
                                }
                            </View>
                        </ScrollView>
                    </View>
                )}
            </Consumer>
        )
    }
}
