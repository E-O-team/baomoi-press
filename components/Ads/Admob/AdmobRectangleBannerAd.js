import React from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { AdMobBanner, AdMobInterstitial, AdMobRewarded, Notifications } from "expo";
import axios from 'axios';
export default class AdmobRectangleBannerAd extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ios: "",
            android: "",
        }
        this.getAdUnitID()
    }

    getAdUnitID = () =>{
        this.cancelTokenSource = axios.CancelToken.source()
        axios.get("https://baomoi.press/wp-json/acf/v3/quangcao?filter[meta_key]=type&filter[meta_value]=rectangle", {
            cancelToken: this.cancelTokenSource.token
        })
        .then(res => {
            res.data.forEach(item => {
                if(item.acf.os == "android" && item.acf.AdPosition == this.props.AdPosition){
                    this.setState({
                        android: item.acf.unitID
                    })
                }else if (item.acf.os == "ios" && item.acf.AdPosition == this.props.AdPosition) {
                    this.setState({
                        ios: item.acf.unitID
                    })
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

    bannerError = () => {
        console.log("An error");
        return;
    }

    render() {
        if(Platform.OS == "ios" && this.state.ios !== ""){
            return (
                <View style={styles.container}>
                    <AdMobBanner
                        bannerSize="mediumRectangle"
                        adUnitID={this.state.ios}
                        didFailToReceiveAdWithError={this.bannerError}
                    />
                </View>
            );
        }else if (Platform.OS == "android" && this.state.android !== "") {
            return (
                <View style={styles.container}>
                    <AdMobBanner
                        bannerSize="mediumRectangle"
                        adUnitID={this.state.android}
                        didFailToReceiveAdWithError={this.bannerError}
                    />
                </View>
            );
        }else{
            return null
        }
    }
    }
const styles = StyleSheet.create({
  container: {
     height: 260,
     alignItems: "center",
     justifyContent: "center",

  },
});
