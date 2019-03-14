import React from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { AdMobBanner, AdMobInterstitial, AdMobRewarded } from "expo";
export default class Ad extends React.Component {

    bannerError() {
        console.log("An error");
        return;
    }

    render() {
        if(Platform.OS == "ios"){
            return (
                <View style={styles.container}>
                    <AdMobBanner
                    style={{flex: 1}}
                    bannerSize="banner"
                    adUnitID="ca-app-pub-8065933325498833/1824869099"
                    testDeviceID="ios"
                    didFailToReceiveAdWithError={this.bannerError}
                    />
                </View>
            );
        }else if (Platform.OS == "android") {
            return (
                <View style={styles.container}>
                    <AdMobBanner
                    style={{flex: 1}}
                    bannerSize="banner"
                    adUnitID="ca-app-pub-8065933325498833/1302356427"
                    testDeviceID="android"
                    didFailToReceiveAdWithError={this.bannerError}
                    />
                </View>
            );
        }
    }
    }
const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: "center"
  },
});
