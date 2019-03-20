import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { AdMobBanner, AdMobInterstitial, AdMobRewarded } from "expo";
export default class InterstitialAd extends React.Component {
  componentDidMount() {
    AdMobInterstitial.setTestDeviceID("EMULATOR");
    // ALWAYS USE TEST ID for Admob ads
    AdMobInterstitial.setAdUnitID("ca-app-pub-8065933325498833/9700942381");
    AdMobInterstitial.addEventListener("interstitialDidLoad", () =>
      console.log("interstitialDidLoad")
    );
    AdMobInterstitial.addEventListener("interstitialDidFailToLoad", () =>
      console.log("interstitialDidFailToLoad")
    );
    AdMobInterstitial.addEventListener("interstitialDidOpen", () =>
      console.log("interstitialDidOpen")
    );
    AdMobInterstitial.addEventListener("interstitialDidClose", () =>
      console.log("interstitialDidClose")
    );
    AdMobInterstitial.addEventListener("interstitialWillLeaveApplication", () =>
      console.log("interstitialWillLeaveApplication")
    );
  }
componentWillUnmount() {
    AdMobInterstitial.removeAllListeners();
  }
bannerError() {
    console.log("An error");
    return;
  }
showInterstitial() {
    AdMobInterstitial.requestAdAsync(() => AdMobInterstitial.showAd());
  }
render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Button
          title="Interstitial"
          onPress={this.showInterstitial}
          containerViewStyle={styles.interstitialBanner}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  interstitialBanner: {
    width: "100%",
    marginLeft: 0
  },
  bottomBanner: {
    position: "absolute",
    bottom: 0
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
