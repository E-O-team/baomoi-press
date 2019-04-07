import React, { Component } from 'react';
import AdmobBannerAd from './Admob/AdmobBannerAd';
import AdmobLargeBannerAd from './Admob/AdmobLargeBannerAd';

export default class BannerAd extends Component {

    render() {
        if(this.props.size == "rectangle"){
            return <AdmobLargeBannerAd AdPosition={this.props.AdPosition}/>
        }else if (this.props.size == "small") {
            return <AdmobBannerAd AdPosition={this.props.AdPosition}/>
        }
    }

}
