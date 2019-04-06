import React from "react";
import { StyleSheet, Text, View, Image, Linking, Platform } from "react-native";
import AdmobBanner from './AdmobBanner'
import AdmobInterstitial from './AdmobInterstitial'
import FacebookBanner from './facebookBanner'
import FacebookInterstitial from './facebookInterstitial'
import CustomNativeAd from './CustomNativeAd'
export default class AdComponent extends React.Component {
    constructor(props){
      super(props)
    }
    componentWillMount(){

    }
    bannerError() {
        console.log("An error");
        return;
    }

    render() {

      switch (this.props.Ad.acf.source) {
        case 'Admob':
          if(this.props.Ad.acf.type != 'Interstitial')
            return <AdmobBanner Ad={this.props.Ad}/>
          break;
        case 'Facebook':
          if(this.props.Ad.acf.type != 'Interstitial')
            return <FacebookBanner Ad={this.props.Ad}/>
          break;
        case 'Custom':
          if(this.props.Ad.acf.type != 'Interstitial')
            return <CustomNativeAd Ad={this.props.Ad}/>

          break;
        default:
          return null
        break;

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
