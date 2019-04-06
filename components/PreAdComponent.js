import React from "react";
import { StyleSheet, Text, View, Image, Linking, Platform } from "react-native";
import { AdMobBanner, FacebookAds } from "expo";
import AdComponent from './Ads/AdComponent'
export default class PreAdComponent extends React.Component {
    constructor(props){
      super(props)
      this.state={Ads : undefined}

    }
    componentWillMount(){
      fetch('https://baomoi.press/wp-json/acf/v3/quangcao?filter[meta_key]=AdPosition&filter[meta_value]=' + this.props.position)
      .then(res => res.json())
      .then(json => this.setState({
          Ads: json.filter(ad => ad.acf.os === Platform.OS),
      }))
    }
    bannerError() {
        console.log("An error");
        return;
    }
    ListHomeAd = () => {

    }
    SplashAd = () => {

    }
    PopUpAd = () => {

    }
    MiddleContentAd = () => {

    }
    BottomContentAd = () => {

      return <AdComponent Ad={this.state.Ads[0]}/>
    }
    RecommendContentAd = () => {
       const firstAd = Math.floor(Math.random() * this.state.Ads.length);
       var secondAd = Math.floor(Math.random() * this.state.Ads.length);
       while(this.state.Ads.length >= 2 && secondAd == firstAd)
         {
           secondAd = Math.floor(Math.random() * this.state.Ads.length);
         }

    }


    render() {
      if(this.state.Ads){
      switch (this.props.position) {
          case 'List Home':
            this.ListHomeAd()
            break;
          case 'Khởi động ứng dụng':
            this.SplashAd()
            break;
          case 'Giữa ứng dụng':
            this.PopUpAd()
            break;
          case 'Content(Giữa bài viết)':
            this.MiddleContentAd()
            break;
          case 'Content(Cuối bài viết)':
            return <AdComponent Ad={this.state.Ads[0]}/>
            break;
          case 'Content(Tin đề xuất)':
            this.RecommendContentAd()
            break;
        default:
            return null
          break;
      }
    } else {return null}
    }
}
const styles = StyleSheet.create({
  container: {
     height: 70,
     alignItems: "center",
     justifyContent: "center",

  },
});
