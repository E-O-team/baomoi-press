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

                            height: 60,
                            marginTop: 20,
                            flexDirection: "row",
                            backgroundColor: backGround,
                            alignItems:'center',
                            borderBottomWidth: 1,
                            borderBottomColor: '#C6C3BC',

                        }}
                    >
                        <View style={{flex: 1, alignItems: "flex-start"}}>
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
                        <View style={{flex: 1, alignItems: "center"}}><Text style={{fontSize: 20, fontWeight: "bold"}}>Theo dõi</Text></View>
                        <View style={{flex: 1}}></View>
                    </SafeAreaView>
                )}
            </Consumer>
            )
        }
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
