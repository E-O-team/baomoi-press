import AdmobInterstitialAd from './Admob/AdmobInterstitialAd';

import React, { Component } from 'react';

export default class InterstitialAd extends Component {

    render() {
        return (
            <AdmobInterstitialAd AdPosition={this.props.AdPosition}/>
        );
    }

}
