import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { ListItem, List, Tile, Card, Divider, Icon, FormLabel, FormInput, FormValidationMessage, Button, } from 'react-native-elements'
import axios from 'axios';
export default class SignUpScreen extends React.Component {
    constructor(){
        super()
        this.state={
            email: "",
            username: "",
            password: "",
            errorMessage: "",
        }
    }
    handleSubmit = () => {
        const data = {
            email: this.state.email,
            username: this.state.username,
            password: this.state.password,
        }
        axios({
            method: "POST",
            url: 'https://baomoi.press/wp-json/wp/v2/users/register',
            data: data
        })
        .then(res => console.log(res))
        .catch(err => console.log(err))
    }
    render(){
        return(
            <View style={styles.container}>
                <View styles={styles.form}>
                    <FormLabel>Email</FormLabel>
                    <FormInput containerStyle={styles.formInputContainerStyle} onChangeText={(text) => this.setState({email: text})}/>
                    <FormLabel>Username</FormLabel>
                    <FormInput containerStyle={styles.formInputContainerStyle} onChangeText={(text) => this.setState({username: text})}/>
                    <FormLabel>Password</FormLabel>
                    <FormInput containerStyle={styles.formInputContainerStyle} onChangeText={(text) => this.setState({password: text})}/>
                </View>
                <FormValidationMessage>{this.state.errorMessage}</FormValidationMessage>
                <Button buttonStyle={styles.button} title="Submit" onPress={this.handleSubmit}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "white",
        justifyContent: 'center',
    },
    button:{
        backgroundColor: "#e12f28",
        margin: 5
    },
})
