import React from 'react';
import { Platform, AsyncStorage, StatusBar, StyleSheet, View, SafeAreaView, Text } from 'react-native';
import { AppLoading, Asset, Font, Icon, Permissions, Notifications } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import { Provider } from './context/context.js'
import dateFormat from 'dateformat';
import splashLogo from './assets/images/logo-splash.png';

if(__DEV__) {
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'))
}
export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
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
      const { status } = await Permissions.askAsync(Permissions.REMOTE_NOTIFICATIONS);
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return;
    }


  }

    componentDidMount() {
        this.registerForPushNotificationsAsync();

        // this._notificationSubscription = Notifications.addListener(this._handleNotification);
    }

  render() {
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
            <SafeAreaView style={{flex: 1,
                                  backgroundColor: "white",
                                  marginTop: Platform.OS == "ios" ? 20 : StatusBar.currentHeight}}>
                {Platform.OS === 'ios' && <StatusBar backgroundColor="white" />}
                <AppNavigator />
            </SafeAreaView>
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
