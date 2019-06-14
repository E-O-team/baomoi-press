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
import Articles from '../components/Articles/Articles';
import axios from 'axios';


export default class NotificationScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            value: null,
            data: []
        };
        this.getNotifications()
    }

    getNotifications = () => {
        this.cancelTokenSource = axios.CancelToken.source()
        axios.get("https://baomoi.press/wp-json/wp/v2/thong_bao", {
            cancelToken: this.cancelTokenSource.token
        })
        .then(res => this.setState({data: res.data}))
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

    setModalVisible = (visible, value) => {
        this.setState({
            modalVisible: visible,
            value: value
        });
    }

    handleSubmit = () => {
        console.log("submited");
    }

    static navigationOptions = ({
        navigation
    }) => {
        return {
            tabBarVisible: false,
            header: (
                <Consumer>
                {({backGround, textColor}) => (
                    <SafeAreaView
                        style={{
                        height: 50,
                        flexDirection: "row",
                        backgroundColor: backGround,
                        alignItems:'center',
                        borderBottomWidth: 1,
                        borderBottomColor: '#e0e0e0'
                        }}
                    >
                        <TouchableOpacity style={{flex: 1, alignItems: 'center'}}
                                          onPress={() => {
                                                    navigation.goBack()
                                                    navigation.openDrawer()
                                                }}>
                            <Icon
                                name='chevron-left'
                                size={40}
                                color={textColor}
                            />
                        </TouchableOpacity>
                        <View style={{flex: 4, alignItems: "center"}}><Text style={{fontSize: 20, fontWeight: "bold", color: textColor}}>Thông báo</Text></View>
                        <View style={{flex: 1}}></View>
                    </SafeAreaView>
                )}
            </Consumer>
            )
        }
    }
    render() {
        return (
            <Consumer>
                {({textColor, backGround}) => (
                    <ScrollView style={{flex: 1, backgroundColor: backGround}}>
                        <FlatList
                            data={this.state.data}
                            extraData={this.state.data}
                            renderItem={({ item, index }) => <Articles notification={true} item={item} navigation={this.props.navigation} ui={{textColor, backGround}} index={index}/>}
                            keyExtractor={item => item.id.toString()}
                        />
                    </ScrollView>
                )}
            </Consumer>
        )
    }
}
