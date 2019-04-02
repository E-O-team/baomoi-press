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
    Alert
} from 'react-native';
import {
    Consumer
} from '../../context/context.js'
import {
    Avatar,
    Card,
    Icon,
    Button,
    Divider,
    Badge,
    FormValidationMessage
} from 'react-native-elements';
import Sources from '../../components/Sources';
import gmobile from '../../assets/images/ExchangeGiftsScreen/icon-Gmobile.jpg';
import mobiphone from '../../assets/images/ExchangeGiftsScreen/icon-mobiphone.jpg';
import vietnammobi from '../../assets/images/ExchangeGiftsScreen/icon-vietnammobi.png';
import viettel from '../../assets/images/ExchangeGiftsScreen/icon-viettel.png';
import vinaphone from '../../assets/images/ExchangeGiftsScreen/icon-vinaphone.png';
import axios from 'axios';
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

export default class ExchangeGiftsModal extends React.Component {
    constructor(props){
        super(props)
        this.state={
            modalVisible: this.props.visible,
            selectedCarrier: null,
            errorMessage: "",
            loading: false,
            buttonTitle: "gửi yêu cầu"
        }
    }

    setSelectedCarrier = (name) => {
        this.setState({
            selectedCarrier: name
        }, () => console.log(this.state.selectedCarrier))
    }

    handleSubmit = () => {
        if(this.state.selectedCarrier !== null){
            this.setState({
                errorMessage: "",
                loading: true,
            }, async() => {
                const data = new FormData()
                let user = JSON.parse(await AsyncStorage.getItem('user'))
                data.append("fields[carrier]", this.state.selectedCarrier)
                data.append("fields[price]", this.props.value)
                data.append("title", user.name)
                data.append("fields[userID]", user.id)
                data.append("fields[request_status]", "Đang chờ duyệt")
                data.append("fields[report]", "null")
                data.append("status", "publish")
                // console.log(data);
                axios({
                    method: "POST",
                    url: 'https://baomoi.press/wp-json/wp/v2/cardrequest',
                    headers: {'Authorization': 'Bearer ' + user.token},
                    data: data
                })
                .then(res => {
                    if(res.status == 201){
                        this.setState({
                            loading: false,
                            buttonTitle: "Gửi yêu cầu thành công!"
                        })
                    }
                })
                .catch(err => console.log(err))
            })
        }else{
            this.setState({
                errorMessage: "Xin bạn hãy chọn nhà mạng"
            })
        }



    }

    render(){

        Carrier = (props) => {
            return(
                <Image source={props.source} style={{height: 55, width: 55, borderWidth: 1, borderColor: "#dadada", borderRadius: 55/2}}/>
            )
        }

        return(
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => this.props.setModalVisible(!this.state.modalVisible, null)}
            >
            <View style={{alignItems: "center", justifyContent:"center", flex:1, backgroundColor: 'rgba(0,0,0,0.5)'}}

            >
                <View style={{backgroundColor: "#edefee" ,height: 210, width: 320, justifyContent: "space-between", paddingBottom: 5, opacity: 2}}>
                    <View>
                        <View style={{flexDirection: "row", alignItems: "center", height: 32, justifyContent: "space-between", backgroundColor:"#555358"}}>
                            <Text style={{color: "white", marginLeft: 3}}>{this.props.value}</Text>

                            <Icon
                                name='close'
                                type='evilicon'
                                size={30}
                                color="white"
                                onPress={() => this.props.setModalVisible(!this.state.modalVisible, null)}
                            />
                        </View>

                        <View style={{backgroundColor:"white", height: 30, width: 320, alignItems: "center", justifyContent: "center"}}>
                            <Text style={{color: "#325340",}}>Chọn nhà mạng</Text>
                            <View style={{width: 100, height: 2, backgroundColor: "#325340"}}></View>
                        </View>

                        <View style={{backgroundColor: "white", paddingBottom: 5, paddingTop: 5}}>
                            <FlatList
                                scrollEnabled={false}
                                data={Carriers}
                                extraData={this.state.selectedCarrier}
                                horizontal={true}
                                renderItem={({item}) =>
                                <Consumer>
                                {({textColor, backGround}) => (
                                    <TouchableOpacity

                                        onPress={() => this.setSelectedCarrier(item.name)}
                                        style={{backgroundColor: backGround}}
                                        underlayColor="white"
                                        activeOpacity={0.5}
                                    >
                                      {
                                        (item.name === this.state.selectedCarrier)?
                                            <Image source={item.source} style={{marginLeft: 7.5 ,height: 55, width: 55, borderWidth: 1, borderColor: "#75aee5", borderRadius: 55/2}}/>
                                        :
                                            <Image source={item.source} style={{marginLeft: 7.5 ,height: 55, width: 55, borderWidth: 1, borderColor: "#dadada", borderRadius: 55/2}}/>
                                      }

                                    </TouchableOpacity>
                                  )}
                                  </Consumer>

                                }
                                keyExtractor={item => item.name}
                            />

                        </View>
                    </View>
                    <View style={{alignItems: "center", justifyContent: "space-around", width: 320}}>
                        <FormValidationMessage>{this.state.errorMessage}</FormValidationMessage>
                        <Button buttonStyle={{backgroundColor: "#e12f28", width: 300}} title={this.state.buttonTitle} onPress={this.handleSubmit} loading={this.state.loading}/>
                    </View>
                </View>
            </View>
            </Modal>
        )
    }
}
