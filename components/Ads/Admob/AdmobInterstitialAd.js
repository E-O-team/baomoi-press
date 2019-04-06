import React from "react";
import { Button, StyleSheet, Text, View, Platform } from "react-native";
import { AdMobBanner, AdMobInterstitial, AdMobRewarded } from "expo";
import axios from 'axios';

export default class AdmobInterstitialAd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            android: "",
            ios: "",
        }
        this.getAdUnitID()
    }

    getAdUnitID = () => {
        axios.get("https://baomoi.press/wp-json/wp/v2/quangcao?filter[meta_key]=type&filter[meta_value]=Interstitial")
        .then(res => {
            res.data.forEach(item => {
                if(item.acf.os == "android" && item.acf.AdPosition == this.props.AdPosition && item.acf.source == "Admob"){
                    this.setState({
                        android: item.acf.unitID
                    }, () => this.showAD())
                }else if (item.acf.os == "ios" && item.acf.AdPosition == this.props.AdPosition && item.acf.source == "Admob") {
                    this.setState({
                        ios: item.acf.unitID
                    }, () => this.showAD())
                }
            })
        })
        .catch(err => console.log(err))
    }

    showAD = () => {
        if(Platform.OS == "ios"){
            AdMobInterstitial.setAdUnitID(this.state.ios);
        }else if (Platform.OS == "android") {
            AdMobInterstitial.setAdUnitID(this.state.android);
        }
        this.showInterstitial()
    }

componentWillUnmount() {
    AdMobInterstitial.removeAllListeners();
  }
bannerError() {
    console.log("An error");
    return;
  }
showInterstitial = async() => {
    await AdMobInterstitial.requestAdAsync();
    await AdMobInterstitial.showAdAsync();

  }
render() {
    return null
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
