import React from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { FacebookAds } from "expo";
import axios from 'axios';

export default class FacebookLargeBanner extends React.Component {

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
        axios.get("https://baomoi.press/wp-json/acf/v3/quangcao?filter[meta_key]=type&filter[meta_value]=largeBanner", {
            cancelToken: this.cancelTokenSource.token
        })
        .then(res => {
            res.data.forEach(item => {
                if(item.acf.os == "android" && item.acf.AdPosition == this.props.AdPosition && item.acf.source == "Facebook"){
                    this.setState({
                        android: item.acf.unitID
                    })
                }else if (item.acf.os == "ios" && item.acf.AdPosition == this.props.AdPosition && item.acf.source == "Facebook") {
                    this.setState({
                        ios: item.acf.unitID
                    })
                }
            })
        })
        .catch(err => console.log(err))
    }

    bannerError() {
        console.log("An error");
        return;
    }
    componentWillUnmount() {
        this.cancelTokenSource && this.cancelTokenSource.cancel()
    }
    render() {
        if(Platform.OS == "android" && this.state.android !== ""){
            return (
                <FacebookAds.BannerAd
                    placementId={this.state.android}
                    type="large"
                    onPress={() => console.log('click')}
                    onError={(error) => console.log('error', error)}
                />
            );
        }else if (Platform.OS == "ios" && this.state.ios !== "") {
            return (
                <FacebookAds.BannerAd
                    placementId={this.state.ios}
                    type="large"
                    onPress={() => console.log('click')}
                    onError={(error) => console.log('error', error)}
                />
            );
        }else{
            return null
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
