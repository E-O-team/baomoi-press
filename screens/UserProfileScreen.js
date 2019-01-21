import React from 'react';
import { Text, View, AsyncStorage, StyleSheet } from 'react-native';
import axios from 'axios';
import { Avatar, Card } from 'react-native-elements';
export default class UserProfile extends React.Component {
    constructor() {
        super()
        this.state={
            user: {}
        }
    }
    getAsyncStorage = async () => {
        let user = await AsyncStorage.getItem('user');
        return JSON.parse(user)
    }
    componentWillMount() {
        this.getAsyncStorage()
        .then(user => {
            axios({
                method: "GET",
                url: 'https://baomoi.press/wp-json/wp/v2/current_user',
                headers: {'Authorization': 'Bearer ' + user.token},
            })
            .then(res => {
                let id = res.data.data.ID
                // console.log(id);
                axios({
                    method: "GET",
                    url: "https://baomoi.press/wp-json/wp/v2/users/" + id,
                    headers: {'Authorization': 'Bearer ' + user.token},
                })
                .then(res => this.setState({
                    user: res.data
                }))
                .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
        })
        // AsyncStorage.getItem('user')
        // .then(res => this.setState({
        //     user: JSON.parse(res)
        // }))
        // .then(() => console.log(this.state))
    }
    render(){
        return(
            <View style={styles.container}>
                <View style={styles.avatar_name_email}>
                    {this.state.user.avatar_urls &&
                        <Avatar
                            overlayContainerStyle={styles.avatar}
                            width={100}
                            rounded
                            source={{uri: this.state.user.avatar_urls['96']}}
                        />
                    }
                    <View style={styles.name_email}>
                        <Text style={styles.name}>{this.state.user.name}</Text>
                        <Text style={styles.email}>{this.state.user.email}</Text>
                    </View>
                </View>
                <View style={styles.usersConfig}>

                </View>
            </View>
        )
    }
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    avatar_name_email: {
        padding: 10,
        backgroundColor: 'white',
        height: 110,
        flexDirection: "row",
        alignItems: "center",
        flex: 1
    },
    avatar: {
        margin: 10,
        backgroundColor: "white",
    },
    name_email: {
        padding: 10,
    },
    name:{
        fontSize: 45,
    },
    email:{
        fontSize: 20,
    },
    usersConfig:{
        flex: 5,
    }
})
