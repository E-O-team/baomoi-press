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
import {Consumer} from '../context/context.js'
import { Avatar, Card, Icon, Button, Divider, Badge } from 'react-native-elements';
import axios from 'axios';
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

    handleSubscribedPressed = () => {
        if(this.checkLogedIn()){
            this.props.navigation.navigate("Following", {
                subscribed: this.state.user.subscribed,
            })
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
        return(
            <Consumer>
                {({textColor, backGround}) => (
                    <View style={{backgroundColor: backGround, flex: 1, padding: 10}}>
                        <View style={{flexDirection: "row", backgroundColor: '#dd273e', marginHorizontal: -10, marginTop: -10, height: 100, alignItems: "flex-end", justifyContent: 'space-between', }}>
                            {user ? (
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
                            ) : (
                                <View style={{flexDirection: "row", alignItems: "center"}}>
                                    <Icon
                                        name='user'
                                        type='feather'
                                        reverse
                                        color="#a6122b"
                                    />
                                    <Text style={{color: "white", fontSize: 20}} onPress={() => this.props.navigation.navigate("Auth")}>Đăng nhập</Text>
                                </View>
                            )}

                            <View>
                                <View style={{alignSelf: "flex-end"}}>
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
                                <TouchableOpacity
                                    style={{flex: 1, alignItems: "center", justifyContent: "space-around"}}
                                    onPress={this.handleSubscribedPressed}
                                >
                                    <View style={{borderWidth: 1, borderColor: "black", borderRadius: 50, height: 45, width: 45}}>
                                        <Icon
                                            name='ios-people'
                                            type='ionicon'
                                            color='#f37f58'
                                            size={40}
                                        />
                                    </View>
                                    <Text style={{color: "#52607b"}}>Theo dõi</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{flex: 1, alignItems: "center", justifyContent: "space-around"}}

                                >
                                    <View style={{borderWidth: 1, borderColor: "black", borderRadius: 50, height: 45, width: 45}}>
                                        <Icon
                                            name='ios-notifications'
                                            type='ionicon'
                                            color='#abbaff'
                                            size={40}
                                        />
                                    </View>
                                    <Text style={{color: "#52607b"}}>Thông báo</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{flex: 1, alignItems: "center", justifyContent: "space-around"}}>
                                    <View style={{borderWidth: 1, borderColor: "black", borderRadius: 50, height: 45, width: 45, justifyContent: "center"}}>
                                        <Icon
                                            name='present'
                                            type='simple-line-icon'
                                            color='#ffcd57'
                                            size={32}
                                        />
                                    </View>
                                    <Text style={{color: "#52607b"}}>Đổi quà</Text>
                                </TouchableOpacity>
                            </View>
                            <Divider style={{ backgroundColor: '#e0e0e0', height: 1}} />
                            <View style={{marginTop: 10}}>
                                <View style={{flexDirection: "row"}}>
                                    <View style={{backgroundColor: "#fc5656", height: 18, width: 5}}></View>
                                    <Text style={{color: textColor, marginLeft: 10, fontSize: 18, fontWeight: "bold"}}>Nhiệm vụ kiếm xu</Text>
                                </View>
                                <View style={{ height: 40, justifyContent: "space-between"}}>
                                    <View></View>
                                    <View style={{flexDirection: "row"}}>
                                        <Icon
                                            name='smartphone'
                                            type='feather'
                                            color='#768cb1'
                                        />
                                    <Text style={{color: textColor, fontSize: 18, marginLeft: 10}} >Xem clip kiếm thêm xu</Text>
                                    </View>
                                    <Divider style={{ backgroundColor: '#e0e0e0', height: 1}} />
                                </View>
                                <View style={{ height: 40, justifyContent: "space-between"}}>
                                    <View></View>
                                    <View style={{flexDirection: "row"}}>
                                        <Icon
                                            name='medal'
                                            type='material-community'
                                            color='#f46c6c'
                                        />
                                        <Text style={{color: textColor, fontSize: 18, marginLeft: 10}} >Chia sẻ kiếm tiền</Text>
                                        <Badge containerStyle={{ backgroundColor: "#fd2624"}} wrapperStyle={{marginLeft: 10}}>
                                            <Text style={{color: "white"}}>HOT</Text>
                                        </Badge>
                                    </View>
                                    <Divider style={{ backgroundColor: '#e0e0e0', height: 1}} />
                                </View>
                            </View>
                            <View style={{marginTop: 20}}>
                                <View style={{flexDirection: "row"}}>
                                    <View style={{backgroundColor: "#fc5656", height: 18, width: 5}}></View>
                                    <Text style={{color: textColor, marginLeft: 10, fontSize: 18, fontWeight: "bold"}}>Nhiệm vụ hằng ngày</Text>
                                </View>
                                <View style={{ height: 40, justifyContent: "space-between"}}>
                                    <View></View>
                                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                                        <View style={{flexDirection: "row"}}>
                                            <Icon
                                                name='comments-o'
                                                type='font-awesome'
                                                color='#f4d644'
                                            />
                                            <Text style={{color: textColor, fontSize: 18, marginLeft: 10}} >Bình luận được duyệt</Text>
                                        </View>
                                            <Badge containerStyle={{ borderColor: "#f9b3b1", borderWidth: 1, backgroundColor: backGround}} wrapperStyle={{width: 80}}>
                                                <Text style={{color: "#ff5756"}}>+1Exp</Text>
                                            </Badge>
                                    </View>
                                    <Divider style={{ backgroundColor: '#e0e0e0', height: 1}} />
                                </View>
                                <View style={{ height: 40, justifyContent: "space-between"}}>
                                    <View></View>
                                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                                        <View style={{flexDirection: "row"}}>
                                            <Icon
                                                name='book'
                                                type='octicon'
                                                color='#f46c6c'
                                            />
                                        <Text style={{color: textColor, fontSize: 18, marginLeft: 10}} >Đọc bài báo 3 phút</Text>
                                        </View>
                                            <Badge containerStyle={{ borderColor: "#f9b3b1", borderWidth: 1, backgroundColor: backGround}} wrapperStyle={{width: 80}}>
                                                <Text style={{color: "#ff5756"}}>+1Exp</Text>
                                            </Badge>
                                    </View>
                                    <Divider style={{ backgroundColor: '#e0e0e0', height: 1}} />
                                </View>
                                <View style={{ height: 40, justifyContent: "space-between"}}>
                                    <View></View>
                                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                                        <View style={{flexDirection: "row"}}>
                                            <Icon
                                                name='ios-people'
                                                type='ionicon'
                                                color='#ea5251'
                                            />
                                        <Text style={{color: textColor, fontSize: 18, marginLeft: 10}} >Chia sẻ bài viết lên facebook</Text>
                                        </View>
                                            <Badge containerStyle={{ borderColor: "#f9b3b1", borderWidth: 1, backgroundColor: backGround}} wrapperStyle={{width: 80}}>
                                                <Text style={{color: "#ff5756"}}>+5Exp</Text>
                                            </Badge>
                                    </View>
                                    <Divider style={{ backgroundColor: '#e0e0e0', height: 1}} />
                                </View>
                                <View style={{ height: 40, justifyContent: "space-between"}}>
                                    <View></View>
                                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                                        <View style={{flexDirection: "row"}}>
                                            <Icon
                                                name='md-mail-open'
                                                type='ionicon'
                                                color='#ea5251'
                                            />
                                        <Text style={{color: textColor, fontSize: 18, marginLeft: 10}} >Mời bạn bè cài đặt app</Text>
                                        </View>
                                            <Badge containerStyle={{ borderColor: "#f9b3b1", borderWidth: 1, backgroundColor: backGround}} wrapperStyle={{width: 80}}>
                                                <Text style={{color: "#ff5756"}}>+10Exp</Text>
                                            </Badge>
                                    </View>
                                    <Divider style={{ backgroundColor: '#e0e0e0', height: 1}} />
                                </View>
                            </View>



                            <View style={{marginTop: 20}}>
                                <View style={{ height: 40, justifyContent: "space-between"}}>
                                    <View></View>
                                    <Text style={{color: textColor, fontSize: 18}} >Điều khoản sử dụng</Text>
                                    <Divider style={{ backgroundColor: '#e0e0e0', height: 1}} />
                                </View>
                                <View style={{ height: 40, justifyContent: "space-between"}}>
                                    <View></View>
                                    <Text style={{color: textColor, fontSize: 18}} >Bình chọn báo mới</Text>
                                    <Divider style={{ backgroundColor: '#e0e0e0', height: 1}} />
                                </View>
                                <View style={{ height: 40, justifyContent: "space-between"}}>
                                    <View></View>
                                    <Text style={{color: textColor, fontSize: 18}} >Gửi email góp ý</Text>
                                    <Divider style={{ backgroundColor: '#e0e0e0', height: 1 }} />
                                </View>
                                {user &&
                                    <View style={{ height: 40, justifyContent: "space-between"}}>
                                        <View></View>
                                        <Text style={{color: textColor, fontSize: 18, fontWeight:"bold"}} onPress={this.logOut}>Đăng xuất</Text>
                                        <Divider style={{ backgroundColor: '#e0e0e0', height: 1 }} />
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
