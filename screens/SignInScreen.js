import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Button,
} from 'react-native';
import axios from 'axios';
import { ListItem, List, Tile, Card, Divider, Icon, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
export default class SignInScreen extends React.Component {
    constructor(){
        super()
        this.state={
            username: "",
            password: "",

        }
    }

    signIn = async () => {
        axios.post('https://baomoi.press/wp-json/jwt-auth/v1/token', {
            username: this.state.username,
            password: this.state.password
        })
        .then((response) => {
            this.signInApp(response.data.token)
        })
        .catch((error) => {
            console.log(error);
        });

    }

    signInApp = async (userToken) => {
        await AsyncStorage.setItem('userToken', userToken)
        this.props.navigation.navigate('App')
    }

    render(){
        return(
            <View style={styles.container}>
                <View styles={styles.form}>
                    <FormLabel>Name</FormLabel>
                    <FormInput containerStyle={styles.formInputContainerStyle} onChangeText={(text) => this.setState({username: text})}/>
                    <FormLabel>Password</FormLabel>
                    <FormInput containerStyle={styles.formInputContainerStyle} onChangeText={(text) => this.setState({password: text})}/>
                </View>
                <FormValidationMessage>Error message</FormValidationMessage>
                <Button title="Sign Up" onPress={() => this.props.navigation.navigate("SignUp")}/>
                <Button title="Forgot Password" onPress={() => this.props.navigation.navigate("ForgotPassword")}/>
                <Button title="SIGN IN" onPress={this.signIn}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
    },
    formInputContainerStyle:{
        paddingHorizontal: 10
    },
    form:{
        padding: 300
    }
})
