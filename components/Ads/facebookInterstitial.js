import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { FacebookAds } from "expo";



export default class InterstitialAd extends React.Component {
  componentDidMount() {
    FacebookAds.AdSettings.addTestDevice(FacebookAds.AdSettings.currentDeviceHash)
  }

showInterstitial() {
    FacebookAds.InterstitialAdManager.showAd('415223319249971_445354909570145')
    .then(didClick => {})
    .catch(error => console.log(error))
  }
render() {
    return (
      <View style={styles.container}>
        <Text>Interstitial</Text>
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

  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
