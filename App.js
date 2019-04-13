import React from 'react';
import { Platform, AsyncStorage, StatusBar, StyleSheet, View, SafeAreaView, Text } from 'react-native';
import NotificationPopup from 'react-native-push-notification-popup';
import { AppLoading, Asset, Font, Icon, Permissions, Notifications } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import { Provider } from './context/context.js'
import dateFormat from 'dateformat';
import splashLogo from './assets/images/logo-splash.png';
export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
    notification: {},
    notificationExist: false,
  };



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
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return;
    }

    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();

    this.notificationSubscription = Notifications.addListener(this._handleNotification);
  }

    componentDidMount() {
        this.registerForPushNotificationsAsync();

        // this._notificationSubscription = Notifications.addListener(this._handleNotification);
    }

    _handleNotification = notification => {
        this.setState({
            notification: notification.data,
            notificationExist: true
        }, () => {
            const {title, body} = this.state.notification
            this.popup.show({
                onPress: function() {console.log('Pressed')},
                appIconSource: require('./assets/images/logo-256x256.png'),
                appTitle: 'Baomoi.press',
                timeText: dateFormat(new Date(), "dd-mm-yyyy"),
                title: title,
                body: body,
            });
        });
    };


  render() {
    const menu = 123
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
        return (
           <AppLoading
             startAsync={this._loadResourcesAsync}
             onError={this._handleLoadingError}
             onFinish={this._handleFinishLoading}
           />
     );
    } else {
      return (
        <Provider>
            <View style={{flex: 1, backgroundColor: "white"}}>
                {Platform.OS === 'ios' && <StatusBar backgroundColor="white" />}
                <NotificationPopup ref={ref => this.popup = ref} />
                <AppNavigator />
            </View>
        </Provider>
      );
    }
    return(
        <View style={{flex: 1}}>
            <Image source={splashLogo} style={{height: 300, width: 300}}/>
        </View>
    )
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        'baomoi-regular': require('./assets/fonts/baomoi-regular-2.0.1.ttf'),
      })
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };}
