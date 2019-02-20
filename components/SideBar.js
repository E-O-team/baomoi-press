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
    AsyncStorage
} from 'react-native';
import {Consumer} from '../context/context.js'
import { Avatar, Card, Icon, Button } from 'react-native-elements';
import axios from 'axios';
const defaultImg ='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png';
export default class SiderBar extends React.Component {
    constructor() {
        super()
        this.state={
            user: {}
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
                    }, () => console.log(this.state.user)))
                    .catch(err => console.log(err))

                })
            }else{
                this.props.navigation.navigate("Auth")
            }
        })
    }

    logOut = async () => {
        AsyncStorage.clear()
        this.props.navigation.navigate("AuthLoadingScreen")
    }

    render(){
        const {user} = this.state
        return(
            <Consumer>
                {({textColor, backGround}) => (
                    <SafeAreaView style={{backgroundColor: backGround, flex: 1, padding: 5}}>
                        <View style={{flexDirection: "row", backgroundColor: '#e12f28', height: 70}}>
                            {user.avatar_urls &&
                                <Avatar
                                    overlayContainerStyle={styles.avatar}
                                    medium
                                    rounded
                                    source={{uri: user.avatar_urls['96'] || defaultImg}}
                                />
                            }
                            <Text style={{color: "white", fontSize: 20,}}>{user.name}</Text>
                        </View>
                    </SafeAreaView>
                )}
            </Consumer>
        )
    }
}
