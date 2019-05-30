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
    Share,
    Platform,
    Clipboard
} from 'react-native';
import {
    Avatar,
    Card,
    Icon,
    Button,
    Divider,
    Badge
} from 'react-native-elements';

import axios from 'axios';

const share_tit = 'Cùng đọc tin tức hot nhất từ Báo mới Press, mã giới thiệu của mình là: '
const baomoi_app_url = 'https://play.google.com/store/apps/details?id=com.press.baomoi'

export default class UserShareTokenModal extends React.PureComponent {
    state = {
        shareToken: ''
    }

    componentDidMount() {
        this.cancelTokenSource = axios.CancelToken.source()
    }

    componentWillUnmount() {
        this.cancelTokenSource && this.cancelTokenSource.cancel()
    }

    componentDidUpdate(prevProps) {
        if(this.props.visible != prevProps.visible) this.getShareToken()

    }

    getShareToken = () => {
        const user = this.props.user

        if(user) {
            if(user.acf.share_Token) {
                this.setState({shareToken : user.acf.share_Token})
            }else {
                this.generateNewShareToken(user)
            }
        }
    }

    generateNewShareToken = (user) => {
        const new_token = user.id.toString() + this.AlphabetGenerate(3)

        const data = new FormData()
        data.append("fields[share_Token]", new_token)

        axios({
            method: "POST",
            url: 'https://baomoi.press/wp-json/acf/v3/users/' + user.id,
            headers: {'Authorization': 'Bearer ' + user.token},
            data: data
        }, {
            cancelToken: this.cancelTokenSource.token
        })
        .then(res => {
            this.setState({shareToken : new_token})
            this.props.updateUser()
        })
        .catch(err => {
            console.log("referenceShare:" + err.message);
        })
    }

    AlphabetGenerate = (len) => {
        var text = "";

        var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

        for (var i = 0; i < len; i++)
        text += charset.charAt(Math.floor(Math.random() * charset.length));

        return text;
    }

    onClipboard = () => {
        Clipboard.setString(this.state.shareToken)

        Alert.alert(
           'Clipboard',
           'Đã sao chép!',
           [
             {text: 'OK', onPress: () => {}},
             { onDismiss: () => {} }
           ],
           { cancelable: false }
        )
    }
    onShare = () => {
        Share.share({
          ...Platform.select({
            ios: {
              message: share_tit + this.state.shareToken,
              url: baomoi_app_url,
            },
            android: {
              message: share_tit + this.state.shareToken +'\nTải app tại đây: ' + baomoi_app_url
            }
          }),
          title: 'Wow, did you see that?'
        }, {
          ...Platform.select({
            ios: {
              // iOS only:
              excludedActivityTypes: [
                'com.apple.UIKit.activity.PostToTwitter'
              ]
            },
            android: {
              // Android only:
              dialogTitle: share_tit + this.state.shareToken +'\nTải app tại đây: ' + baomoi_app_url
            }
          })
        });
    }

    render(){
        return(
          <Modal
              animationType="fade"
              transparent={true}
              visible={this.props.visible}
              onRequestClose={() => this.props.setModalVisible(!this.props.visible)}
          >
            <View style={{alignItems: "center", justifyContent:"center", flex:1, backgroundColor: 'rgba(0,0,0,0.5)'}}

            >
                <View style={{backgroundColor: "#f0eff4" ,height: 300, width: 300, justifyContent: "space-between", paddingBottom: 5, opacity: 2}}>
                    <View style={{flexDirection: "column"}}>
                        <View style={{flexDirection: "row", borderBottomWidth: 1, borderBottomColor: '#B8B8B8', alignItems: "center", height: 32, backgroundColor:"#ffffff"}}>
                            <View style={{flex: 1, alignItems: "flex-start"}}>
                                <Icon
                                    name='close'
                                    type='evilicon'
                                    size={30}
                                    color="black"
                                    onPress={() => this.props.setModalVisible(!this.props.visible, null)}
                                />
                            </View>
                            <View style={{flex: 2, alignItems: "center"}}>
                                <Text style={{color: "black", marginLeft: 3}}>Chia sẻ App kiếm tiền</Text>
                            </View>
                            <View style={{flex: 1}}></View>
                        </View>
                        <View style={{padding: 15}}>
                            <View style={{width: 114*1.4, height: 40*1.4, alignSelf: "center", marginTop: 10}}>
                                <Icon
                                    name='medal'
                                    type='material-community'
                                    color='#f46c6c'
                                    size={90}
                                />
                            </View>
                            <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 30}}>
                                <View style={{flex:1, backgroundColor: 'black', height: 0.5, opacity: 0.5}}></View>
                                <View style={{flex:3, alignItems: "center"}}>
                                    <Text style={{ fontSize: 15, opacity: 0.8}}>Mã giới thiệu của bạn</Text>
                                </View>
                                <View style={{flex:1, backgroundColor: 'black', height: 0.5, opacity: 0.5}}></View>
                            </View>
                            <View style={{marginTop: 20,
                                          marginHorizontal: -30,
                                          borderRadius: 6,
                                          justifyContent:'space-between',
                                          alignItems:'center'}}>
                                <View style={{
                                                flexDirection: 'row'}} >
                                    <Text style={{fontSize: 18, fontFamily: 'baomoi-regular', color: '#696969', marginRight: 5}}>{this.state.shareToken}</Text>
                                    <Icon
                                        name='content-copy'
                                        type='material-community'
                                        color='#696969'
                                        size={30}
                                        onPress={this.onClipboard}
                                    />
                                </View>
                                <Button
                                    buttonStyle={{  backgroundColor: '#C14450',
                                                    width: 150,
                                                    height: 30,
                                                    marginTop: 10,
                                                    borderRadius: 5,
                                                }}
                                    title="Chia sẻ"
                                    onPress={this.onShare}
                                />
                            </View>
                            <View>
                                <Text style={{fontStyle: "italic", textAlign: "center", marginTop: 10}}>Chia sẻ để mời bạn bè cùng đọc tin tức hot nhất từ Báo mới Press</Text>
                            </View>
                        </View>


                    </View>
                </View>
            </View>
          </Modal>
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
