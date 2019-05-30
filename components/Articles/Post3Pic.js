import React from 'react';
import {
    TouchableOpacity,
    View,
    Image,
    Dimensions,
    TouchableWithoutFeedback
} from 'react-native';
import { Divider, Icon } from 'react-native-elements';
import {Consumer} from '../../context/context.js'
import { BaomoiText } from '../StyledText';
import moment from 'moment/min/moment-with-locales'
import spinner from '../../assets/images/spinner.gif';
var { width, height } = Dimensions.get('window');
moment.locale('vi');
const defaultImg ='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png';

export default class Post3Pic extends React.PureComponent {

    navigate = () => this.props.navigation.navigate("Article", {
                        Article: this.props.item
                    })

    render(){
        const item = this.props.item
        const ui = this.props.ui
        const index = this.props.index
        return(
            <View style={{flex: 1, flexDirection: 'column', paddingHorizontal: 10, paddingVertical: 25}}>
                <View style={{flex: 2}}>
                    <View style={{flexDirection: "row", marginBottom: 7}}>
                        <TouchableOpacity
                            onPress={this.navigate}
                            style={{flex: 1}}
                            activeOpacity={1}
                        >
                            <Image
                                source={{uri: item.content.images[0] || defaultImg}}
                                style= {{height: 90, marginLeft: 5, borderRadius: 5}}
                                loadingIndicatorSource={spinner}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.navigate}
                            style={{flex: 1}}
                            activeOpacity={1}
                        >
                            <Image
                                source={{uri: item.content.images[1] || defaultImg}}
                                style= {{height: 90, marginLeft: 5, borderRadius: 5}}
                                loadingIndicatorSource={spinner}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.navigate}
                            style={{flex: 1}}
                            activeOpacity={1}
                        >
                            <Image
                                source={{uri: item.content.images[2] || defaultImg}}
                                style= {{height: 90, marginLeft: 5, borderRadius: 5}}
                                loadingIndicatorSource={spinner}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableWithoutFeedback style={{flex: 1}} onPress={this.navigate}>
                    <View>
                        <View style={{flexDirection: "row", alignItems:'center'}}>
                            {
                              (item.taxonomy_source[0])?
                                 <BaomoiText style={{color: '#696969', fontSize: 14}}>{item.taxonomy_source[0].name} - {moment(item.modified).fromNow().replace("trước", "").replace("một", "1")}</BaomoiText>
                              :
                                  <BaomoiText style={{color: '#696969', fontSize: 14}}>{moment(item.modified).fromNow().replace("trước", "").replace("một", "1")}</BaomoiText>
                            }
                            <Comments id={item.id}/>
                        </View>
                        <BaomoiText style={{fontSize: 17.3, fontWeight: '500', color: ui.textColor}} numberOfLines={3}>{item.title.plaintitle}</BaomoiText>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }
}
