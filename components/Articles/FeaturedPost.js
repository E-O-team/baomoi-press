import React from 'react';
import {
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    Image,
    Dimensions,
    FlatList,
    Text
} from 'react-native';
import { Divider, Icon } from 'react-native-elements';
import {Consumer} from '../../context/context.js'
import { BaomoiText } from '../StyledText';
import moment from 'moment/min/moment-with-locales'
import spinner from '../../assets/images/spinner.gif';
import BannerAd from '../Ads/BannerAd';
var { width, height } = Dimensions.get('window');

moment.locale('vi');
const defaultImg ='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png';

export default class FeaturedPost extends React.PureComponent {

    navigate = () => this.props.navigation.navigate("Article", {
                        Article: this.props.item
                    })
    navigateOtherPosts = (item) => this.props.navigation.navigate("Article", {
                        Article: item
                    })

    render(){
        const item = this.props.item
        const ui = this.props.ui
        const index = this.props.index
        return(
            <View>



                <TouchableWithoutFeedback
                    onPress={this.navigate}
                >
                    <View>
                        <View style={{flexDirection: "row", justifyContent: 'space-between', padding: 10, alignItems: "center"}}>
                            <View style={{flexDirection: 'row', alignItems:'center'}}>
                                <View style={{backgroundColor: 'red', width: 8, height: 8, borderRadius: 4, marginBottom: 3}}></View>
                                <BaomoiText style={{fontWeight: "bold",marginLeft:5, color: ui.textColor, fontSize: 15}}>TIÊU ĐIỂM</BaomoiText>
                            </View>
                            <Icon
                                name='angle-right'
                                type='font-awesome'
                                color='#696969'
                            />
                        </View>
                        <View style={{marginTop: 5}}>
                            <Image
                                source={{uri: item.thumb || defaultImg}}
                                style= {{height: 180, width: width}}
                                loadingIndicatorSource={spinner}
                            />
                            <View style={{padding: 10}}>
                                <View style={{flexDirection: "row", alignItems:'center'}}>

                                    {
                                      (item.taxonomy_source[0])?
                                         <BaomoiText style={{color: '#696969', fontSize: 14}}>{item.taxonomy_source[0].name} - {moment(item.modified).fromNow().replace("trước", "").replace("một", "1")}</BaomoiText>
                                      :
                                          <BaomoiText style={{color: '#696969', fontSize: 14}}>{moment(item.modified).fromNow().replace("trước", "").replace("một", "1")}</BaomoiText>
                                    }
                                    <Comments id={item.id}/>
                                </View>
                                <BaomoiText style={{fontSize: 22, fontWeight: '500', color: ui.textColor}}>{item.title.plaintitle}</BaomoiText>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <View style={{padding: 10}}>
                    <FlatList
                        data={item.otherFeaturedPosts}
                        renderItem={({ item, index }) =>
                            <TouchableWithoutFeedback
                                onPress={() => this.navigateOtherPosts(item)}
                                key={item.id}
                            >
                                <View style={{flexDirection: "row", marginBottom: 3, alignItems: "flex-start"}}>
                                    <Icon
                                        type="entypo"
                                        name="dot-single"
                                    />
                                <BaomoiText style={{fontSize: 16, textAlign: "justify", color: '#696969', marginLeft: 5,flex: 1, flexWrap: 'wrap'}}>{item.title.plaintitle}</BaomoiText>
                                </View>
                            </TouchableWithoutFeedback>
                        }
                        keyExtractor={item => item.id.toString()}
                    />
                </View>
            </View>
        )
    }
}
