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
  SafeAreaView,
  Alert
} from 'react-native';
import { Facebook } from 'expo';
import axios from 'axios';
import { ListItem, List, Tile, Card, Divider, Icon, FormLabel, FormInput, FormValidationMessage,Button, } from 'react-native-elements'
import logo from '../assets/images/logo-press.png';
const FBAppID = "418043712281827"
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
    signIn = async (email, id, name, picture) => {
        // if (this.state.username !== "" && this.state.password !== ""){
        //     this.setState({loading: true})
        //     axios.post('https://baomoi.press/wp-json/jwt-auth/v1/token', {
        //         email: this.state.username,
        //         password: this.state.password
        //     })
        //     .then((response) => {
        //         let user = response.data
        //         this.signInApp(user)
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //         this.setState({
        //             errorMessage: "The username or password you have entered is incorrect"
        //         })
        //     });
        // }else {
        //     this.setState({
        //         errorMessage: "Please enter your username and password"
        //     })
        // }

        this.setState({loading: true})
        axios.post('https://baomoi.press/wp-json/jwt-auth/v1/token', {
            username: name,
            password: id,
            email: email,
        })
        .then((response) => {
            let user = response.data
            console.log(user);
            this.signInApp(user)
        })
        .catch((err) => {
            console.log(err.response.data);
            this.setState({
                errorMessage: "The username or password you have entered is incorrect"
            })
        });
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

    FBLogin = async() => {
        try {
            const {
                type,
                token,
                expires,
                permissions,
                declinedPermissions,
            } = await Facebook.logInWithReadPermissionsAsync(FBAppID, {
                permissions: ['public_profile', 'email'],
            });
            if (type === 'success') {
                // Get the user's name using Facebook's Graph API
                const response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,picture.type(large),email`);
                const {email, id, name, picture} = await response.json()
                this.handleCreateAccount(email, id, name, picture)
            } else {
            // type === 'cancel'
            }
        } catch ({ message }) {
            console.log(message);
        }
    }

    handleCreateAccount = (email, id, name, picture) => {
        const data = {
            email: email,
            username: name,
            password: id,
        }
        axios({
            method: "POST",
            url: 'https://baomoi.press/wp-json/wp/v2/users/register',
            data: data
        })
        .then(res => {
            if(res.data.code == 200){
                this.signIn(email, id, name, picture)
            }
        })
        .catch(err => {
            if(err.response.data.code == 406){
                this.signIn(email, id, name, picture)
            }
        })
    }
    render(){
        return(
            <SafeAreaView style={styles.container}>
                <View>
                    <View style={{width: 150, height: 150, alignSelf: "center"}}>
                        <Image
                            source={logo}
                            style={{ width: 150, height: 150, alignSelf: 'center' }}
                            resizeMode="contain"
                        />
                    </View>
                    <View styles={styles.form}>
                        <FormLabel>User Name</FormLabel>
                        <FormInput textContentType="username" containerStyle={styles.formInputContainerStyle} onChangeText={(text) => this.setState({username: text})}/>
                        <FormLabel>Password</FormLabel>
                        <FormInput textContentType="password" secureTextEntry={true} containerStyle={styles.formInputContainerStyle} onChangeText={(text) => this.setState({password: text})}/>
                    </View>
                    <FormValidationMessage>{this.state.errorMessage}</FormValidationMessage>
                    <View>
                        <Button buttonStyle={styles.button} title="Đăng Nhập" loading={this.state.loading} onPress={this.FBLogin}/>
                        <Button buttonStyle={styles.button} title="Trở Về" onPress={() => this.props.navigation.navigate("App")}/>
                    </View>
                </View>
                <View style={{justifyContent: "flex-end", marginBottom: 20}}>
                    <Button buttonStyle={styles.button} title="Đăng Kí" onPress={() => this.props.navigation.navigate("SignUp")}/>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "white",
        justifyContent: "space-between"
    },
    formInputContainerStyle:{
        paddingHorizontal: 10
    },
    button:{
        backgroundColor: "#e12f28",
        margin: 5
    },
})
