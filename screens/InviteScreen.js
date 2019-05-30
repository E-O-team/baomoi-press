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

import axios from 'axios';

export default class InviteScreen extends React.PureComponent {
    constructor(){
        super()
        this.state={
            data: []
        }
        this.cancelTokenSource = axios.CancelToken.source()
    }

    // getUserID = async() => {
    //     // let user = JSON.parse(await AsyncStorage.getItem('user'))
    //     // console.log(user);
    //
    //     let id = JSON.parse(await AsyncStorage.getItem('user')).id
    //     let token = JSON.parse(await AsyncStorage.getItem('user')).token
    //     console.log(token);
    //     console.log(id);
    //     axios({
    //         method: "GET",
    //         url: "https://baomoi.press/wp-json/wp/v2/cardrequest?filter[meta_key]=userID&filter[meta_value]="+ id +"&status=publish, draft",
    //         headers: {'Authorization': 'Bearer ' + token},
    //         cancelToken: this.cancelTokenSource.token
    //     })
    //     .then(res => this.setState({data: res.data}, () => console.log(this.state.data)))
    //     .catch(err => {
    //         if(axios.isCancel(err)){
    //             return
    //         }else{
    //             console.log(err)
    //         }
    //     })
    // }

    componentWillUnmount() {
        this.cancelTokenSource && this.cancelTokenSource.cancel()
    }

    tokenGenerate = (len) => {
      var text = "";

      var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

      for (var i = 0; i < len; i++)
        text += charset.charAt(Math.floor(Math.random() * charset.length));

      return text;
    }

    render(){

        return(
            <View>
                <Text></Text>
                <Text>Inviting your friends for the name of love</Text>
            </View>
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
