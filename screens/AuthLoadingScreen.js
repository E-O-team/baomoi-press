import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Image,
  NetInfo,
  Alert,
  ImageBackground,
} from 'react-native';
import splashLogo from '../assets/images/logo-splash.png';
import {
  Permissions,
  Notifications,
  AdMobInterstitial
} from 'expo';
import HandleNetworkError from '../components/HandleNetworkError';
import axios from 'axios';
export default class AuthLoadingScreen extends React.Component {
    constructor(props) {
      super(props);
      this.checkConnect()

    }

    checkConnect = () => {
        NetInfo.isConnected.fetch().then(isConnected => {
            if(isConnected == false){
                Alert.alert("Vui lòng kiểm tra lại kết nối mạng và khởi động lại ứng dụng")
            }else if (isConnected == true) {
                NetInfo.addEventListener('connectionChange', this.handleFirstConnectivityChange);
                this._bootstrapAsync();
            }
        });
    }

  handleFirstConnectivityChange = (isConnected) => {
      if(isConnected.type !== "none"){
          console.log("connected!!");
      }else{
          Alert.alert("Vui lòng kiểm tra lại kết nối mạng và khởi động lại ứng dụng")
      }
  }


  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    let user = JSON.parse(await AsyncStorage.getItem('user'));
    let ExpoToken = await Notifications.getExpoPushTokenAsync();
    if(user){
        axios({
            method: "POST",
            url: 'https://baomoi.press/wp-json/jwt-auth/v1/token/validate',
            headers: {'Authorization': 'Bearer ' + user.token},
        })
        .then((res) => {
            if(res.status == 200){
                const data = new FormData()
                data.append("fields[deviceToken]", ExpoToken)
                axios({
                    method: "POST",
                    url: 'https://baomoi.press/wp-json/acf/v3/users/' + user.id,
                    headers: {'Authorization': 'Bearer ' + user.token},
                    data: data
                })
                .then((res) => {
                    if(res.status == 200){
                        // this.showInterstitialAd()
                        this.props.navigation.navigate("App")
                    }
                })
                .catch(err => {
                    // AsyncStorage.clear()
                    // this.props.navigation.navigate("App")
                    console.log("here:" + err.message);
                })
            }


        })
        .catch(err => {
            AsyncStorage.clear()
            this.props.navigation.navigate("App")
        })
    }else{
        this.props.navigation.navigate("App")
    }
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
  };

  // Render any loading content that you like here
  render() {
      return(
          <ImageBackground source={splashLogo} style={styles.image}>
              <ActivityIndicator/>
          </ImageBackground>
      )
    // return (
    //   <View style={styles.container}>
    //     <Image source={splashLogo} style={styles.image}/>
    //     <ActivityIndicator/>
    //   </View>
    // );
  }
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    image:{
        resizeMode: "cover",
        flex: 1,
        // height: 200,
        // width: 200
    }
})
