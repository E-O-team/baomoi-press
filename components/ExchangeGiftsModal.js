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

export default class ExchangeGiftsModal extends React.Component {
    constructor(props){
        super(props)
        this.state={
            modalVisible: this.props.visible
        }
    }


    render(){
        return(
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.modalVisible}
            >
            <View style={{alignItems: "center", justifyContent:"center", flex:1, backgroundColor: 'rgba(0,0,0,0.5)'}}

            >
                <View style={{backgroundColor: "#edefee" ,height: 300, width: 300, justifyContent: "space-between", paddingBottom: 5, opacity: 2}}>
                    <View>
                        <View style={{flexDirection: "row", alignItems: "center", height: 32, justifyContent: "space-between", backgroundColor:"#555358"}}>
                            <View></View>
                            <Text style={{color: "white", textAlign: "center"}}>Đổi mã thẻ di động</Text>
                            <Icon
                                name='close'
                                type='evilicon'
                                size={30}
                                color="white"
                                onPress={() => this.props.setModalVisible(!this.state.modalVisible, null)}
                            />
                        </View>
                        <View style={{backgroundColor:"white", height: 30, width: 300, alignItems: "center", justifyContent: "center"}}>
                            <Text style={{color: "#325340",}}>Chọn nhà mạng</Text>
                            <View style={{width: 100, height: 2, backgroundColor: "#325340"}}></View>
                        </View>
                        <Text>{this.props.value}</Text>
                    </View>
                    <Button buttonStyle={{backgroundColor: "#e12f28", margin: 5}} title="Gửi yêu cầu" onPress={this.handleSubmit}/>
                </View>
            </View>
            </Modal>
        )
    }
}
