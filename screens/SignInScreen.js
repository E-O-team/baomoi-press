import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { ListItem, List, Tile, Card, Divider, Icon, FormLabel, FormInput, FormValidationMessage,Button, } from 'react-native-elements'
export default class SignInScreen extends React.Component {
    constructor(){
        super()
        this.state={
            username: "",
            password: "",
            errorMessage: "",
        }
    }

    signIn = async () => {
        if (this.state.username !== "" && this.state.password !== ""){
            axios.post('https://baomoi.press/wp-json/jwt-auth/v1/token', {
                username: this.state.username,
                password: this.state.password
            })
            .then((response) => {
                this.signInApp(response.data.token)
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    errorMessage: "The username or password you have entered is incorrect"
                })
            });
        }else {
            this.setState({
                errorMessage: "Please enter your username and password"
            })
        }
    }

    signInApp = async (userToken) => {
        await AsyncStorage.setItem('userToken', userToken)
        this.props.navigation.navigate('App')
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={{flex: 1}}>
                    <View styles={styles.form}>
                        <FormLabel>User Name</FormLabel>
                        <FormInput containerStyle={styles.formInputContainerStyle} onChangeText={(text) => this.setState({username: text})}/>
                        <FormLabel>Password</FormLabel>
                        <FormInput containerStyle={styles.formInputContainerStyle} onChangeText={(text) => this.setState({password: text})}/>
                    </View>
                    <FormValidationMessage>{this.state.errorMessage}</FormValidationMessage>
                    <Button buttonStyle={styles.button} title="SIGN IN" onPress={this.signIn}/>
                </View>
                <View style={{flex:1, justifyContent: "flex-end", marginBottom: 20}}>
                    <Button buttonStyle={styles.button} title="Sign Up" onPress={() => this.props.navigation.navigate("SignUp")}/>
                    <Button buttonStyle={{margin: 5}} title="Forgot Password" onPress={() => this.props.navigation.navigate("ForgotPassword")}/>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    formInputContainerStyle:{
        paddingHorizontal: 10
    },
    form:{
        padding: 300
    },
    button:{
        backgroundColor: "#e12f28",
        margin: 5
    },
    label:{
        color: "black"
    }
})
