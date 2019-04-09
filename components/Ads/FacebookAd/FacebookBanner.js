import React from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import axios from 'axios';
import { FacebookAds } from "expo";
FacebookAds.AdSettings.addTestDevice(FacebookAds.AdSettings.currentDeviceHash)

export default class FacebookBanner extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ios: "",
            android: "",
        }
        this.getAdUnitID()
    }

    getAdUnitID = () =>{
        axios.get("https://baomoi.press/wp-json/acf/v3/quangcao?filter[meta_key]=type&filter[meta_value]=banner")
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

    render() {
        return (
          <FacebookAds.BannerAd
            placementId={this.props.Ad.acf.unitID}
            type="banner"
            onPress={() => console.log('click')}
            onError={(error) => console.log('error', error)}
          />
        );
    }
}
const styles = StyleSheet.create({
  container: {
     height: 70,
     alignItems: "center",
     justifyContent: "center",

  },
});
