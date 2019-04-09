import React from 'react';
import {
    TouchableOpacity,
    View,
    Image,
    Dimensions,
    StyleSheet
} from 'react-native';
import { Divider, Icon } from 'react-native-elements';
import {Consumer} from '../../context/context.js'
import { BaomoiText } from '../StyledText';
import moment from 'moment/min/moment-with-locales'
import BannderAd from '../Ads/BannerAd';
var { width, height } = Dimensions.get('window');
moment.locale('vi');
const defaultImg ='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png';

export default class Video extends React.PureComponent {
    render(){
        const item = this.props.item
        const ui = this.props.ui
        const index = this.props.index
        if(index == 0){
            return(
                <View>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => this.props.navigation.navigate("Article", {
                            Article: item
                        })}
                    >
                        <View style={{flex: 1, flexDirection: "column", justifyContent: 'center'}}>
                              <View style={{alignItems: 'center', justifyContent:'center'}}>
                                  <Image
                                    key={index}
                                    style={{ width: width, height: width * 9/16}}
                                    source={{ uri: item.thumb || defaultImg }}
                                    resizeMode='cover'/>
                                  <View style={{position:'absolute', opacity:0.6}}>
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
                                         <BaomoiText style={{color: '#696969', fontSize: 15}}>{item.taxonomy_source[0].name} - {moment(item.modified).fromNow()}</BaomoiText>
                                      :
                                          <BaomoiText style={{color: '#696969', fontSize: 15}}>{moment(item.modified).fromNow()}</BaomoiText>
                                    }
                                    <Comments id={item.id}/>
                                </View>
                                <BaomoiText style={{fontSize: 20, fontWeight: '500', fontFamily: 'baomoi-regular', color: ui.textColor}}>{item.title.plaintitle}</BaomoiText>
                            </View>
                            <Divider style={{ backgroundColor: '#e0e0e0', height: 1, marginTop: 5}} />
                        </View>
                    </TouchableOpacity>
                </View>
            )
        }else{
            return(
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => this.props.navigation.navigate("Article", {
                        Article: item
                    })}
                >
                    <View style={{flex: 1, flexDirection: "column", justifyContent: 'center'}}>
                          <View style={{alignItems: 'center', justifyContent:'center'}}>
                              <Image
                                key={index}
                                style={{ width: width, height: width * 9/16}}
                                source={{ uri: item.thumb || defaultImg }}
                                resizeMode='cover'/>
                              <View style={{position:'absolute', opacity:0.6}}>
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
                                     <BaomoiText style={{color: '#696969', fontSize: 15}}>{item.taxonomy_source[0].name} - {moment(item.modified).fromNow()}</BaomoiText>
                                  :
                                      <BaomoiText style={{color: '#696969', fontSize: 15}}>{moment(item.modified).fromNow()}</BaomoiText>
                                }
                                <Comments id={item.id}/>
                            </View>
                            <BaomoiText style={{fontSize: 20, fontWeight: '500', fontFamily: 'baomoi-regular', color: ui.textColor}}>{item.title.plaintitle}</BaomoiText>
                        </View>
                        <Divider style={{ backgroundColor: '#e0e0e0', height: 1, marginTop: 5}} />
                    </View>
                </TouchableOpacity>
            )
        }


    }
}
const styles = StyleSheet.create({
  triangleShape: {
    width: 0,
    height: 0,
    borderLeftWidth: 120,
    borderTopWidth: 60,
    borderBottomWidth: 60,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderLeftColor: 'black'
  }
})
