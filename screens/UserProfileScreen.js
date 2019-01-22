import React from 'react';
import { Text, View, AsyncStorage, StyleSheet, Button } from 'react-native';
import axios from 'axios';
import { Avatar, Card } from 'react-native-elements';
const defaultImg ='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png';
export default class UserProfile extends React.Component {
    constructor() {
        super()
        this.state={
            user: {}
        }
    }
    componentWillMount() {
        AsyncStorage.getItem('user')
        .then(user => {
            if(user){
                this.setState({
                    user: JSON.parse(user)
                })
            }else{
                this.props.navigation.navigate("Auth")
            }
        })
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
                            source={{uri: this.state.user.avatar_urls['96'] || defaultImg}}
                        />
                    }
                    <View style={styles.name_email}>
                        <Text style={styles.name}>{this.state.user.name}</Text>
                        <Text style={styles.email}>{this.state.user.email}</Text>
                    </View>
                </View>
                <View style={styles.usersConfig}>
                    <Text>Xu: {this.state.user.xu}</Text>
                    <Text>Exp: {this.state.user.exp}</Text>
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
