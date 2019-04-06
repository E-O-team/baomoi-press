import React from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { FacebookAds } from "expo";
FacebookAds.AdSettings.addTestDevice(FacebookAds.AdSettings.currentDeviceHash)

export default class Ad extends React.Component {

    bannerError() {
        console.log("An error");
        return;
    }

    render() {
            if(this.props.Ad.acf.os === Platform.OS ){
                return (
                  <FacebookAds.BannerAd
                    placementId={this.props.Ad.acf.unitID}
                    type={this.props.Ad.acf.type}
                    onPress={() => console.log('click')}
                    onError={(error) => console.log('error', error)}
                  />
                );
            }
    }
}
const styles = StyleSheet.create({
  container: {
     height: 70,
     alignItems: "center",
     justifyContent: "center",

  },
});
