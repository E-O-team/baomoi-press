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
        if(this.state.email !== "" && this.state.username !== "" && this.state.password !== ""){
            axios({
                method: "post",
                url: 'https://baomoi.press/wp-json/wp/v2/users',
                headers: {'Authorization': 'Bearer ' + "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvYmFvbW9pLnByZXNzIiwiaWF0IjoxNTQ3NzQzMjk3LCJuYmYiOjE1NDc3NDMyOTcsImV4cCI6MTU0ODM0ODA5NywiZGF0YSI6eyJ1c2VyIjp7ImlkIjoiMjAifX19.iAs8cW6oXuGLOJgQbHh8e4D2NdaGUnDVnBlk8hHKV0Q"},
                data: {
                    email: this.state.email,
                    username: this.state.username,
                    password: this.state.password,
                }
            })
            .then(() => this.props.navigation.navigate('Auth'))
            .catch(err => console.log(err))
        }else{
            this.setState({
                errorMessage: "Please fill all fields"
            })
        }
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
        justifyContent: 'center',
    },
    button:{
        backgroundColor: "#e12f28",
        margin: 5
    },
})
