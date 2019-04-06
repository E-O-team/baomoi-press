import React from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { AdMobBanner, AdMobInterstitial, AdMobRewarded } from "expo";
export default class Ad extends React.Component {
  constructor(props){
    super(props)
  }
    bannerError() {
        console.log("An error");
        return;
    }

    render() {
        if(this.props.Ad.acf.type === 'rectangle') this.props.Ad.acf.type = 'mediumRectangle'
        if(this.props.Ad.acf.os === Platform.OS){
            return (
                <View style={styles.container}>
                    <AdMobBanner
                    bannerSize={this.props.Ad.acf.type}
                    adUnitID={this.props.Ad.acf.unitID}
                    testDeviceID={this.props.Ad.acf.os}
                    didFailToReceiveAdWithError={this.bannerError}
                    />
                </View>
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
