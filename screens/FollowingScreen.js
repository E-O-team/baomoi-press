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
} from 'react-native';
import {Consumer} from '../context/context.js'
import { Avatar, Card, Icon, Button, Divider, Badge } from 'react-native-elements';
import Sources from '../components/Sources';
import axios from 'axios';

export default class FollowingScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            data: []
        }
        this.cancelTokenSource = axios.CancelToken.source()
    }

    componentDidMount() {

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
                    },{
                        cancelToken: this.cancelTokenSource.token
                    })
                    .then((res) => this.setState({
                        data: Object.values(res.data.subscribed)
                    }))
                    .catch(err => console.log(err))

                })
            }else{
                this.props.navigation.navigate("Auth")
            }
        })
    }

    static navigationOptions = ({navigation}) => {
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
                            borderBottomColor: '#e0e0e0',

                        }}
                    >
                        <TouchableOpacity style={{flex: 1, alignItems: "center"}}
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
                        <View style={{flex: 4, alignItems: "center"}}><Text style={{fontSize: 20, fontWeight: "bold", color: textColor}}>Theo dõi</Text></View>
                        <View style={{flex: 1}}></View>
                    </SafeAreaView>
                )}
            </Consumer>
            )
        }
    }

    componentWillUnmount() {
        this.cancelTokenSource && this.cancelTokenSource.cancel()
    }

    render(){
        return(
            <Consumer>
                {({textColor, backGround}) => (
                    <View style={{flex: 1, backgroundColor: backGround}}>
                        <FlatList
                            data={this.state.data}
                            extraData={this.state.data}
                            renderItem={({ item, index }) => <Sources item={item} navigation={this.props.navigation} ui={{textColor, backGround}} index={index}/>}
                            keyExtractor={item => item}
                        />
                    </View>
                )}
            </Consumer>
        )
    }
};
