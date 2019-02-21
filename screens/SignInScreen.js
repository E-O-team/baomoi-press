import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView
} from 'react-native';
import axios from 'axios';
import { ListItem, List, Tile, Card, Divider, Icon, FormLabel, FormInput, FormValidationMessage,Button, } from 'react-native-elements'
import logo from '../assets/images/logo-press.png';
export default class SignInScreen extends React.Component {
    constructor(){
        super()
        this.state={
            username: "",
            password: "",
            errorMessage: "",
            loading: false,
        }
    }

    static navigationOptions = { header: null }
    signIn = async () => {
        if (this.state.username !== "" && this.state.password !== ""){
            this.setState({loading: true})
            axios.post('https://baomoi.press/wp-json/jwt-auth/v1/token', {
                username: this.state.username,
                password: this.state.password
            })
            .then((response) => {
                let user = response.data
                console.log(user);
                this.signInApp(user)
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

    signInApp = (user) => {
        axios({
            method: "GET",
            url: 'https://baomoi.press/wp-json/wp/v2/current_user',
            headers: {'Authorization': 'Bearer ' + user.token},
        })
        .then(res => {
            let id = res.data.data.ID
            return axios({
                method: "GET",
                url: "https://baomoi.press/wp-json/wp/v2/users/" + id,
                headers: {'Authorization': 'Bearer ' + user.token},
            })
            .then(res => {
                res.data.token = user.token
                AsyncStorage.setItem('user', JSON.stringify(res.data))
                this.props.navigation.navigate('App')
            })
        })
        .catch(err => console.log(err))
    }

    render(){
        return(
            <SafeAreaView style={styles.container}>
                <View style={{flex: 1}}>
                    <Image
                        source={logo}
                        style={{ width: 150, height: 150, resizeMode:'contain', alignSelf: 'center', marginTop: 10 }}
                    />
                    <View styles={styles.form}>
                        <FormLabel>User Name</FormLabel>
                        <FormInput textContentType="username" containerStyle={styles.formInputContainerStyle} onChangeText={(text) => this.setState({username: text})}/>
                        <FormLabel>Password</FormLabel>
                        <FormInput textContentType="password" secureTextEntry={true} containerStyle={styles.formInputContainerStyle} onChangeText={(text) => this.setState({password: text})}/>
                    </View>
                    <FormValidationMessage>{this.state.errorMessage}</FormValidationMessage>
                    <View>
                    <Button buttonStyle={styles.button} title="Đăng Nhập" loading={this.state.loading} onPress={this.signIn}/>
                    <Button buttonStyle={styles.button} title="Trở Về" onPress={() => this.props.navigation.navigate("App")}/>
                    </View>
                </View>
                <View style={{flex:1, justifyContent: "flex-end", marginBottom: 20}}>
                    <Button buttonStyle={styles.button} title="Đăng Kí" onPress={() => this.props.navigation.navigate("SignUp")}/>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "white"
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
