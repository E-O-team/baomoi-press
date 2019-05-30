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

    navigate = () => this.props.navigation.navigate("Article", {
                        Article: this.props.item
                    })

    render(){
        const item = this.props.item
        const ui = this.props.ui
        const index = this.props.index
            return(
                <View style={{paddingHorizontal: 10, paddingVertical: 20}}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={this.navigate}
                    >
                        <View style={{flex: 1, flexDirection: "column"}}>
                              <View style={{alignItems: 'center', justifyContent:'center'}}>
                                  <Image
                                    key={index}
                                    style={{ width: width - 40, height: (width-40) * 9/16, borderRadius: 5, overflow: 'hidden', overlayColor: ui.backGround}}
                                    source={{ uri: item.thumb || defaultImg }}

                                    />
                                  <View style={{position:'absolute', opacity:0.6}}>
                                    <Icon
                                        size={125}
                                        name='controller-play'
                                        type='entypo'
                                        color='white'
                                    />
                                  </View>
                                  <View style={{position:'absolute', opacity:0.8}}>
                                    <Icon
                                        size={120}
                                        name='controller-play'
                                        type='entypo'
                                        color='black'
                                    />
                                  </View>
                              </View>
                            <View style={{marginLeft: 10}}>
                                <View style={{flexDirection: "row", alignItems:'center', marginTop: 8, justifyContent:'flex-start'}}>
                                    {
                                      (item.taxonomy_source[0])?
                                         <BaomoiText style={{color: '#696969', fontSize: 14}}>{item.taxonomy_source[0].name} - {moment(item.modified).fromNow().replace("trước", "").replace("một", "1")}</BaomoiText>
                                      :
                                          <BaomoiText style={{color: '#696969', fontSize: 14}}>{moment(item.modified).fromNow().replace("trước", "").replace("một", "1")}</BaomoiText>
                                    }
                                    <Comments id={item.id}/>
                                </View>
                                <BaomoiText style={{fontSize: 18, fontWeight: '500', fontFamily: 'baomoi-regular', color: ui.textColor}}>{item.title.plaintitle}</BaomoiText>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            )


    }
}
const styles = StyleSheet.create({
})
