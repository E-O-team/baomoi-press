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
    Modal,
    TouchableHighlight,
    Alert,
    Clipboard
} from 'react-native';
import {
    Consumer
} from '../context/context.js'
import {
    Avatar,
    Card,
    Icon,
    Button,
    Divider,
    Badge
} from 'react-native-elements';
import Sources from '../components/Sources';
import axios from 'axios';
import gmobile from '../assets/images/ExchangeGiftsScreen/icon-Gmobile.jpg';
import mobiphone from '../assets/images/ExchangeGiftsScreen/icon-mobiphone.jpg';
import vietnammobi from '../assets/images/ExchangeGiftsScreen/icon-vietnammobi.png';
import viettel from '../assets/images/ExchangeGiftsScreen/icon-viettel.png';
import vinaphone from '../assets/images/ExchangeGiftsScreen/icon-vinaphone.png';
import dateFormat from 'dateformat';
const Carriers = [
    {
        name: "Gmobile",
        source: gmobile
    },
    {
        name: "Mobiphone",
        source: mobiphone
    },
    {
        name: "Vietnammobi",
        source: vietnammobi
    },
    {
        name: "Viettel",
        source: viettel
    },
    {
        name: "Vinaphone",
        source: vinaphone
    },
]

export default class ExchangeHistory extends React.PureComponent {
    constructor(){
        super()
        this.state={
            data: []
        }
        this.getUserID()
    }

    getUserID = async() => {
        // let user = JSON.parse(await AsyncStorage.getItem('user'))
        // console.log(user);
        this.cancelTokenSource = axios.CancelToken.source()
        let id = JSON.parse(await AsyncStorage.getItem('user')).id
        let token = JSON.parse(await AsyncStorage.getItem('user')).token
        console.log(token);
        console.log(id);
        axios({
            method: "GET",
            url: "https://baomoi.press/wp-json/wp/v2/cardrequest?filter[meta_key]=userID&filter[meta_value]="+ id +"&status=publish, draft",
            headers: {'Authorization': 'Bearer ' + token},
            cancelToken: this.cancelTokenSource.token
        })
        .then(res => this.setState({data: res.data}, () => console.log(this.state.data)))
        .catch(err => {
            if(axios.isCancel(err)){
                return
            }else{
                console.log(err)
            }
        })
    }

    componentWillUnmount() {
        this.cancelTokenSource && this.cancelTokenSource.cancel()
    }

    render(){
        CardRequest = (props) => {
            const {date, id,} = props.data
            const {card_code, carrier, price, request_status, series_number} = props.data.acf
            var carrierPic
            Carriers.forEach(item => {
                if(carrier == item.name){
                    carrierPic = item.source
                }
            })
            return(
                <View style={{
                    marginBottom: 10,
                    backgroundColor: "white",
                    padding: 10,
                    borderWidth: 0.5,
                    borderColor: "#dadada",
                    borderRadius: 9,
                }}>
                    <View style={{flexDirection: "row", justifyContent: "flex-start", alignItems: "center"}}>
                        <Image source={carrierPic} style={{height: 55, width: 55, borderWidth: 1, borderColor: "#dadada"}}/>
                        <View style={{marginLeft: 10, justifyContent: "space-between", height: 55}}>
                            <Text style={{fontSize: 19}}>{carrier}</Text>
                            <Text style={{fontSize: 19, fontWeight: "bold"}}>{price}</Text>
                        </View>
                    </View>
                    <View style={{marginTop: 10}}>
                        <View style={{flex: 1, justifyContent: "flex-start"}}>
                            <Divider/>
                        </View>
                        <View style={{flex: 2, justifyContent: "center"}}>
                            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                                <Text style={{fontSize: 20}}>Mã nạp:</Text>
                                {(request_status == "đã duyệt")?
                                    <Text style={{fontSize: 20, fontWeight: "bold"}}>{card_code}</Text>
                                    :
                                    <Text style={{fontSize: 20}}>********</Text>
                                }
                            </View>
                            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                                <Text style={{fontSize: 20}}>Số seri:</Text>
                                {(request_status == "đã duyệt")?
                                    <Text style={{fontSize: 20, fontWeight: "bold"}}>{series_number}</Text>
                                    :
                                    <Text style={{fontSize: 20}}>********</Text>
                                }
                            </View>
                        </View>
                        <View style={{flex: 1, justifyContent: "flex-end"}}>
                            <Divider/>
                        </View>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10}}>
                        <View style={{backgroundColor: "#ecf4ff", flex: 6, alignItems: "center", justifyContent: "center", height: 29}}>
                            <Text style={{color: "#4d90e1", fontSize: 20}}>{dateFormat(date, "dd-mm-yyyy")}</Text>
                        </View>
                        <View style={{flex: 0.4}}></View>
                        {(request_status == "đã duyệt")?
                            <TouchableOpacity
                                onPress={() => Clipboard.setString("*100*" + card_code + "#")}
                                activeOpacity={0.5}
                                style={{flex: 6, height: 29}}
                            >
                                <View style={{backgroundColor: "#ecf4ff", alignItems: "center", justifyContent: "center", height: 29}}>
                                    <Text style={{color: "#4d90e1", fontSize: 20}}>Nạp ngay</Text>
                                </View>
                            </TouchableOpacity>
                            :
                            <View style={{flex: 6, height: 29}}>
                                {(request_status == "Bị từ chối")?
                                    <TouchableOpacity
                                        onPress={() => Alert.alert("Yêu cầu của bạn đã bị từ chối do vi phạm điều khoản thanh toán", "Bạn muốn phản hồi vui lòng liên hệ về mail baomoi.press@gmail.com")}
                                        activeOpacity={0.5}
                                    >
                                        <View style={{backgroundColor: "#e0272d", alignItems: "center", justifyContent: "center", height: 29}}>
                                            <Text style={{color: "white", fontSize: 20}}>{request_status}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    :
                                    <View style={{backgroundColor: "#e0272d", alignItems: "center", justifyContent: "center", height: 29}}>
                                        <Text style={{color: "white", fontSize: 20}}>{request_status}</Text>
                                    </View>
                                }
                            </View>
                        }
                    </View>
                </View>
            )
        }
        return(
            <ScrollView style={styles.container}>
                <FlatList
                    data={this.state.data}
                    extraData={this.state.data}
                    renderItem={({ item, index }) => <CardRequest data={item}/>}
                    keyExtractor={item => item.id.toString()}
                />
            </ScrollView>
        )
    }
};

styles = StyleSheet.create({
    container:{
        flex: 1,
        padding: 10,
        backgroundColor: "#f3f3f3",
    }
})
