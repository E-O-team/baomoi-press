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
} from 'react-native';
import splashLogo from '../assets/images/logo-splash.png';
import {
  Permissions,
  Notifications
} from 'expo';
import HandleNetworkError from '../components/HandleNetworkError';
import axios from 'axios';
export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.checkConnect()
    this.registerForPushNotificationsAsync()

  }

  registerForPushNotificationsAsync = async() => {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;
  console.log(existingStatus);
  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== 'granted') {

    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
    console.log(status);
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== 'granted') {
      console.log(finalStatus);
    return;
  }

  // Get the token that uniquely identifies this device
  let token = await Notifications.getExpoPushTokenAsync();

  this._notificationSubscription = Notifications.addListener(this._handleNotification);
  // POST the token to your backend server from where you can retrieve it to send push notifications.
  // return fetch(PUSH_ENDPOINT, {
  //   method: 'POST',
  //   headers: {
  //     Accept: 'application/json',
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     token: {
  //       value: token,
  //     },
  //     user: {
  //       username: 'Brent',
  //     },
  //   }),
  // });
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
        .then(() => {
            // console.log(user.id);
            // const data = new FormData()
            // data.append("fields[deviceToken]", ExpoToken)
            // axios({
            //     method: "POST",
            //     url: 'https://baomoi.press/wp-json/acf/v3/users/' + user.id,
            //     headers: {'Authorization': 'Bearer ' + user.token},
            //     data: data
            // })
            // .then((res) => {
            //     console.log(res.status);
            //     this.props.navigation.navigate("App")
            // })
            // .catch(err => console.log(err))
            this.props.navigation.navigate("App")

        })
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
