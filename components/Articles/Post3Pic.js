import React from 'react';
import {
    TouchableOpacity,
    View,
    Image,
    Dimensions
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
    render(){
        const item = this.props.item
        const ui = this.props.ui
        const index = this.props.index
        return(
            <View style={{flex: 1, flexDirection: 'column', padding: 10}}>
                <View style={{flex: 2}}>
                    <View style={{flexDirection: "row", marginBottom: 7}}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => this.props.navigation.navigate("Article", {
                                Article: item
                            })}
                            style={{flex: 1}}
                        >
                            <Image
                                source={{uri: item.content.images[0] || defaultImg}}
                                style= {{height: 90, marginLeft: 5, borderRadius: 5}}
                                loadingIndicatorSource={spinner}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => this.props.navigation.navigate("Article", {
                                Article: item
                            })}
                            style={{flex: 1}}
                        >
                            <Image
                                source={{uri: item.content.images[1] || defaultImg}}
                                style= {{height: 90, marginLeft: 5, borderRadius: 5}}
                                loadingIndicatorSource={spinner}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => this.props.navigation.navigate("Article", {
                                Article: item
                            })}
                            style={{flex: 1}}
                        >
                            <Image
                                source={{uri: item.content.images[2] || defaultImg}}
                                style= {{height: 90, marginLeft: 5, borderRadius: 5}}
                                loadingIndicatorSource={spinner}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{flex: 1}}>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => this.props.navigation.navigate("Article", {
                            Article: item
                        })}
                    >
                    <View style={{flexDirection: "row", alignItems:'center'}}>
                        {
                          (item.taxonomy_source[0])?
                             <BaomoiText style={{color: '#696969', fontSize: 15}}>{item.taxonomy_source[0].name} - {moment(item.modified).fromNow()}</BaomoiText>
                          :
                              <BaomoiText style={{color: '#696969', fontSize: 15}}>{moment(item.modified).fromNow()}</BaomoiText>
                        }
                        <Comments id={item.id}/>
                    </View>
                        <BaomoiText style={{fontSize: 20, fontWeight: '500', color: ui.textColor}} numberOfLines={3}>{item.title.plaintitle}</BaomoiText>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
