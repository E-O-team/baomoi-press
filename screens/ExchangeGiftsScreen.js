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
    FlatList,
    Dimensions,
} from 'react-native';
import {Consumer} from '../context/context.js'
import { Avatar, Card, Icon, Button, Divider, Badge } from 'react-native-elements';
import Sources from '../components/Sources';
import axios from 'axios';
import VND50K from "../assets/images/50kVND.jpg"
import VND100K from "../assets/images/100kVND.jpg"
import VND200K from "../assets/images/200kVND.jpg"
import VND500K from "../assets/images/500kVND.jpg"
import USD50 from "../assets/images/50USD.jpg"
import USD100 from "../assets/images/100USD.jpg"
import ExchangeGiftsModal from '../components/ExchangeGiftsModal';

const {width} = Dimensions.get("window")
export default class ExchangeGiftsScreen extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state ={
            modalVisible: false,
            value: null
        }
    }

    setModalVisible = (visible, value) => {
        this.setState({
            modalVisible: visible,
            value: value
        });
    }

    static navigationOptions = ({navigation}) => {
        return {
            tabBarVisible: false,
            header: (
              <Consumer>
                {({backGround, textColor}) => (
                    <SafeAreaView
                        style={{
                        height: 60,
                        marginTop: 20,
                        flexDirection: "row",
                        backgroundColor: backGround,
                        alignItems:'center',
                        borderBottomWidth: 1,
                        borderBottomColor: '#C6C3BC'
                        }}
                    >
                        <View>
                            <Icon
                                name='chevron-left'
                                size={35}
                                color={textColor}
                                onPress={() => {
                                    navigation.goBack()
                                    navigation.openDrawer()
                                }}
                            />
                        </View>
                    </SafeAreaView>
                )}
            </Consumer>
            )
        }
    }
    render(){
        const {Width} = Dimensions.get('window')
        Rules = (props) => {
            return(
                <View style={{flexDirection: "row", marginTop: 15}}>
                    <Icon
                        name={props.name}
                        type={props.type}
                        color="#01969a"
                        size={35}
                    />
                    <Text style={{marginLeft: 10, fontSize: 15, flex: 1, flexWrap: 'wrap'}}>{props.content}</Text>
                </View>
            )
        }

        Cards = (props) => {
            return(
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => this.setModalVisible(!this.state.modalVisible, props.value)}
                >
                    <Image
                        style={{height: (width/2-15)/2.217, width: width/2-15}}
                        source={props.source}
                    />
                </TouchableOpacity>
            )
        }
        return(
            <Consumer>
                {({textColor, backGround}) => {
                    return(
                        <ScrollView style={{flex: 1, backgroundColor: "#f3f3f3"}}>
                            <View style={{paddingBottom: 10}}>
                                {this.state.modalVisible && <ExchangeGiftsModal visible={this.state.modalVisible} value={this.state.value} setModalVisible={this.setModalVisible}/>}
                                <View style={{backgroundColor: "#dd273e", height: 110, alignItems: "center", justifyContent: "center"}}>
                                    <Text style={{color: "white", fontSize: 25}}>Mời bạn ngay</Text>
                                    <Text style={{color: "white", fontSize: 25}}>Nhận quà mỏi tay</Text>
                                </View>
                                <View style={{backgroundColor:"white", padding: 10, marginTop: 15}}>
                                    <Text style={{fontSize: 20.5, fontWeight: "bold"}}>Thông tin của bạn</Text>
                                    <View style={{ height: 110, alignItems: "center", justifyContent:"center", flexDirection: "row"}}>
                                        <View style={{ flex:1, alignItems: "center", justifyContent: "center"}}>
                                            <Text style={{color: "#01969a", fontSize: 30, fontWeight: "bold"}}>0</Text>
                                            <Text style={{color: "black", fontSize: 20}}>Bạn bè đã mời ></Text>
                                        </View>
                                        <View style={{ backgroundColor: "#949494", height: 100, width: 2}}></View>
                                        <View style={{ flex:1, alignItems: "center", justifyContent: "center"}}>
                                            <Text style={{color: "#01969a", fontSize: 30, fontWeight: "bold"}}>{this.props.navigation.getParam("xu")}</Text>
                                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                                <Icon
                                                    type="material-community"
                                                    name="coin"
                                                    color="#01969a"
                                                    size={25}
                                                />
                                                <Text style={{color: "black", fontSize: 20}}> Xu thưởng ></Text>
                                            </View>

                                        </View>
                                    </View>
                                </View>
                                <View style={{backgroundColor:"white", padding: 10, marginTop: 15}}>
                                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                                        <Text style={{fontSize: 19.5, fontWeight: "bold"}}>THỂ LỆ HƯỚNG DẪN</Text>
                                        <TouchableOpacity>
                                            <Text style={{color: "#00b990"}}>Chi tiết ></Text>
                                        </TouchableOpacity>
                                    </View>
                                    <Rules
                                        name="people"
                                        type="simple-line-icon"
                                        content="mời bạn bè cài đặt và đăng nhập lần đầu tiên thành công trên ứng dụng báo mới."
                                    />
                                    <Rules
                                        name="star-circle-outline"
                                        type="material-community"
                                        content="Mỗi lượt mời thành công, cả hai đều được cộng 100 xu, tối đa 1300 xu/ngày."
                                    />
                                    <Rules
                                        name="present"
                                        type="simple-line-icon"
                                        content="Dùng xu để đổi lấy các phần thưởng hấp dẫn, mỗi phần thưởng được đổi 1 lần/ngày."
                                    />
                                </View>
                                <View style={{backgroundColor:"white", padding: 10, marginTop: 15}}>
                                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                                        <Text style={{fontSize: 19.5, fontWeight: "bold"}}>PHẦN THƯỞNG</Text>
                                        <TouchableOpacity
                                            activeOpacity={0.5}
                                            onPress={() => this.props.navigation.navigate("ExchangeHistory")}
                                        >
                                            <Text style={{color: "#00b990"}}>Lịch sử đổi thưởng ></Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 5}}>
                                        <Cards source={VND50K} value="50000 VND"/>
                                        <Cards source={VND100K} value="100000 VND"/>
                                    </View>

                                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 5}}>
                                        <Cards source={VND200K} value="200000 VND"/>
                                        <Cards source={VND500K} value="500000 VND"/>
                                    </View>

                                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 5}}>
                                        <Cards source={USD50} value="50 USD"/>
                                        <Cards source={USD100} value="100 USD"/>
                                    </View>

                                </View>
                                <View style={{backgroundColor:"white", padding: 10, marginTop: 15}}>
                                    <View style={{flexDirection: "row", marginTop: 10}}>
                                        <Icon
                                            name="mail"
                                            type="entypo"
                                            color="#01969a"
                                            size={35}
                                        />
                                        <View>
                                            <Text style={{marginLeft: 10, fontSize: 15, flex: 1, flexWrap: 'wrap'}}>Chăm sóc khách hàng</Text>
                                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                                <Text style={{marginLeft: 10, fontSize: 15, fontWeight: "bold"}}>baomoi.press@gmail.com</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    )
                }}
            </Consumer>
        )
    }
}
