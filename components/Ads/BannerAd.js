import React, { Component } from 'react';
import AdmobBannerAd from './Admob/AdmobBannerAd';
import AdmobLargeBannerAd from './Admob/AdmobLargeBannerAd';

export default class BannerAd extends Component {

    render() {
        if(this.props.size == "large"){
            return <AdmobLargeBannerAd/>
        }else if (this.props.size == "small") {
            return <AdmobBannerAd/>
        }
    }

}
