import React from "react";
import { Button, StyleSheet, Text, View, Platform, AsyncStorage } from "react-native";
import { FacebookAds } from "expo";
import axios from 'axios';

export default class FacebookInterstitial extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            android: "",
            ios: "",
            failed: false,
        }
        this.getAdUnitID()
    }

    getAdUnitID = () => {

        this.cancelTokenSource = axios.CancelToken.source()
        axios.get("https://baomoi.press/wp-json/wp/v2/quangcao?filter[meta_key]=type&filter[meta_value]=Interstitial", {
            cancelToken: this.cancelTokenSource.token
        })
        .then(res => {
            AsyncStorage.setItem('PopUpAds', JSON.stringify(res.data))
            res.data.forEach(item => {
                if(item.acf.os == "android" && item.acf.AdPosition == this.props.AdPosition && item.acf.source == "Facebook"){
                    this.setState({
                        android: item.acf.unitID
                    }, () => this.showAD())
                }else if (item.acf.os == "ios" && item.acf.AdPosition == this.props.AdPosition && item.acf.source == "Facebook") {
                    this.setState({
                        ios: item.acf.unitID
                    }, () => this.showAD())
                }
            })
        })
        .catch(err => {
            if(axios.isCancel(err)){
                return
            }else{
                console.log(err)
            }
        })
    }

    componentWillUnmount() {
        this.cancelTokenSource && this.cancelTokenSource.cancel()
    }

    componentDidMount() {

    }

    showAD = () => {
        if(Platform.OS == "ios"){
            this.showInterstitial(this.state.ios);
        }else if (Platform.OS == "android") {
            this.showInterstitial(this.state.android);
        }
    }

    bannerError() {
        console.log("An error");
        return;
      }
    showInterstitial = async(placementId) => {
          FacebookAds.InterstitialAdManager.showAd(placementId)
            .then(didClick => {})
            .catch(error => console.log(error))

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
