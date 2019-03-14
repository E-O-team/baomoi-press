import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Image,
  NetInfo
} from 'react-native';
import splashLogo from '../assets/images/logo-splash.png';
import HandleNetworkError from '../components/HandleNetworkError';
import axios from 'axios';
export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }


  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    let user = await AsyncStorage.getItem('user');
    // NetInfo.isConnected.fetch().then(isConnected => {
    //     console.log('First, is ' + (isConnected ? 'online' : 'offline'));
    // });
    // function handleFirstConnectivityChange(isConnected) {
    //     console.log('Then, is ' + (isConnected ? 'online' : 'offxline'));
    //     NetInfo.isConnected.removeEventListener(
    //     'connectionChange',
    //     handleFirstConnectivityChange
    //     );
    // }
    // NetInfo.isConnected.addEventListener(
    //     'connectionChange',
    //     handleFirstConnectivityChange
    // );
    if(user){
        user = JSON.parse(user)
        axios({
            method: "POST",
            url: 'https://baomoi.press/wp-json/jwt-auth/v1/token/validate',
            headers: {'Authorization': 'Bearer ' + user.token},
        })
        .then(() => this.props.navigation.navigate("App"))
        .catch(err => {
            if(err.response){

            }
        })
    }else{
        AsyncStorage.clear()
        this.props.navigation.navigate("App")
    }
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <Image source={splashLogo} style={styles.image}/>
        <ActivityIndicator/>
      </View>
    );
  }
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    image:{
        height: 300,
        width: 300
    }
})
