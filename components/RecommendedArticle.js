import React from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    FlatList,
    SafeAreaView,
    Dimensions
} from 'react-native';
import HTMLView from 'react-native-htmlview';
import { BaomoiText } from '../components/StyledText';
import { Divider, Icon } from 'react-native-elements';
import Moment from 'moment';
import {Consumer} from '../context/context.js'
import BannerAd from './Ads/BannerAd'
import InterstitialAd from './Ads/InterstitialAd'
import {FacebookAds} from 'expo'
import ArticleAd from './Ads/ArticleAd'
import axios from 'axios';


import moment from 'moment/min/moment-with-locales'
const defaultImg ='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png';

const screenWidth = Dimensions.get('window').width;
const videoHeightRatio = 9/16;
moment.locale('vi');


export default class RecommendedArticle extends React.PureComponent{

    state = {
      numberOfComments : 0,
    }

  componentDidMount(){
    this.cancelTokenSource = axios.CancelToken.source()
    this.fetchComment()

  }

  fetchComment = () => {
    const request_length = this.state.numberOfComments + 20
    axios.get("https://baomoi.press/wp-json/wp/v2/comments?post="+this.props.item.id +"&per_page="+request_length.toString(),{
        cancelToken: this.cancelTokenSource.token
    })
    .then(res => res.data)
    .then(json => {
      this.setState({numberOfComments : json.length}, () => {if(this.state.numberOfComments >= request_length) this.fetchComment()  })
    })
    // .then(json => console.log(json))
    .catch(err => console.log(err))
  }


  navigate = () => {
      this.props.navigation.push("Article", {
                        Article: this.props.item,
                        isCounting : true
                      })
    }

  componentWillUnmount() {

     this.cancelTokenSource && this.cancelTokenSource.cancel()
  }
  render(){

    const item = this.props.item
    return(
        <Consumer>
          {({textColor, backGround, fontSizeRatio}) => (
                            <TouchableWithoutFeedback
                                onPress={this.navigate}
                            >
                                <View>
                                  {(item.format === 'video') ?
                                          <View style={{flex: 1, flexDirection: "column", justifyContent: 'center', marginTop: 20}}>
                                              <View style={{alignItems: 'center', justifyContent:'center'}}>
                                                  <Image
                                                    style={{ width: screenWidth-20, height: ((screenWidth-20) * 9/16), borderRadius: 10}}
                                                    source={{ uri: item.thumb || defaultImg }}
                                                    resizeMode='cover'/>
                                                  <View style={{position:'absolute', opacity: 0.6}}>
                                                    <Icon
                                                        size={120}
                                                        name='controller-play'
                                                        type='entypo'
                                                        color='black'
                                                    />
                                                  </View>


                                              </View>
                                              <View>
                                                    <View style={{flexDirection: "row", alignItems:'center', marginTop: 8}}>
                                                        {
                                                          (item.taxonomy_source[0])?
                                                             <BaomoiText style={{color: '#696969', fontSize: 15}}>{item.taxonomy_source[0].name} - {moment(item.modified).fromNow().replace("trước", "").replace("một", "1")}</BaomoiText>
                                                          :
                                                              <BaomoiText style={{color: '#696969', fontSize: 15}}>{moment(item.modified).fromNow().replace("trước", "").replace("một", "1")}</BaomoiText>
                                                        }
                                                        <View style={{justifyContent:'center'}}>
                                                            {
                                                              (this.state.numberOfComments !== 0)?
                                                              <View style={{flexDirection: "row", alignItems: "center"}}>
                                                                  <Text style={{fontSize: 12, color: '#696969'}}> - {this.state.numberOfComments}</Text>
                                                                  <Icon containerStyle={{marginTop: -2}} name='comment' type="evilicon" color='#696969' size={20}/>
                                                              </View> : <View></View>
                                                            }
                                                         </View>
                                                    </View>
                                                        <BaomoiText style={{ fontSize: 18*fontSizeRatio,color:textColor, fontWeight: '400'}}>{item.title.plaintitle}</BaomoiText>
                                              </View>
                                          </View> :

                                          <View style={{flex: 1, flexDirection: "row", alignItems:'center', padding: 10, height: 130}}>
                                              <View style={{flex: 2}}>
                                                  <View style={{flexDirection: "row", alignItems:'center'}}>
                                                      {
                                                        (item.taxonomy_source[0])?
                                                           <BaomoiText style={{color: '#696969', fontSize: 15}}>{item.taxonomy_source[0].name} - {moment(item.modified).fromNow().replace("trước", "").replace("một", "1")}</BaomoiText>
                                                        :
                                                            <BaomoiText style={{color: '#696969', fontSize: 15}}>{moment(item.modified).fromNow().replace("trước", "").replace("một", "1")}</BaomoiText>
                                                      }
                                                      <View style={{justifyContent:'center'}}>
                                                          {
                                                            (this.state.numberOfComments !== 0)?
                                                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                                                <Text style={{fontSize: 12, color: '#696969'}}> - {this.state.numberOfComments}</Text>
                                                                <Icon containerStyle={{marginTop: -2}} name='comment' type="evilicon" color='#696969' size={20}/>
                                                            </View> : <View></View>
                                                          }
                                                       </View>
                                                  </View>
                                                  <BaomoiText style={{fontSize: 17.3, fontWeight: '500',color: textColor}}>{item.title.plaintitle}</BaomoiText>
                                              </View>
                                              <Image
                                                  source={{uri :item.thumb || defaultImg}}
                                                  style={{height: 90, flex: 1, marginLeft: 5, borderRadius: 5}}
                                              />
                                          </View>
                                    }

                                    <Divider style={{ backgroundColor: '#e0e0e0'}} />
                                </View>

                            </TouchableWithoutFeedback>
                            )}
                        </Consumer>
        )

    }
}
