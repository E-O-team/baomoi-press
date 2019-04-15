import React, { Component } from 'react';
import AdmobBannerAd from './Admob/AdmobBannerAd';
import AdmobLargeBannerAd from './Admob/AdmobLargeBannerAd';
import AdmobRectangleBannerAd from './Admob/AdmobRectangleBannerAd';
import FacebookBanner from './FacebookAd/FacebookBanner'
import FacebookRectangle from './FacebookAd/FacebookRectangle'
import FacebookLargeBanner from './FacebookAd/FacebookLargeBanner'
import CustomBannerAd from './Custom/CustomBannerAd';
import CustomLargeBannerAd from './Custom/CustomLargeBannerAd';
import CustomRectangleBannerAd from './Custom/CustomRectangleBannerAd';
export default class BannerAd extends React.PureComponent {

    shuffle = (array) => {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
        }

        return array;
    }

    render() {
        const AdTypes = ["Admob", "Custom", "Facebook"]
        // const AdTypes = ["Admob"]
        let choosenAdType = this.shuffle(AdTypes)
        if(this.props.size == "large"){
            if(choosenAdType[0] == "Admob"){
                return <AdmobLargeBannerAd AdPosition={this.props.AdPosition}/>
            }else if (choosenAdType[0] == "Custom") {
                return <CustomLargeBannerAd AdPosition={this.props.AdPosition}/>
            }else if (choosenAdType[0] == "Facebook") {
                return <FacebookLargeBanner AdPosition={this.props.AdPosition}/>
            }
        }else if (this.props.size == "small") {
            if(choosenAdType[0] == "Admob"){
                return <AdmobBannerAd AdPosition={this.props.AdPosition}/>
            }else if (choosenAdType[0] == "Custom") {
                return <CustomBannerAd AdPosition={this.props.AdPosition}/>
            }else if (choosenAdType[0] == "Facebook") {
                return <FacebookBanner AdPosition={this.props.AdPosition}/>
            }
        }else if (this.props.size == "rectangle") {
            if(choosenAdType[0] == "Admob"){
                return <AdmobRectangleBannerAd AdPosition={this.props.AdPosition}/>
            }else if (choosenAdType[0] == "Custom") {
                return <CustomRectangleBannerAd AdPosition={this.props.AdPosition}/>
            }else if (choosenAdType[0] == "Facebook") {
                return <FacebookRectangle AdPosition={this.props.AdPosition}/>
            }
        }
    }

}
