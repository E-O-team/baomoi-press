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

export default class Post1Pic extends React.PureComponent {

    render(){
        const item = this.props.item
        const ui = this.props.ui
        const index = this.props.index

        return(
            <View style={{padding: 10, height: 130}}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => this.props.navigation.navigate("Article", {
                        Article: item
                    })}
                    style={{flex: 1}}
                >
                    <View style={{flex: 1, flexDirection: "row", alignItems:'center'}}>
                        <View style={{flex: 2}}>
                            <View style={{flexDirection: "row", alignItems:'center'}}>
                                {
                                  (item.taxonomy_source[0])?
                                     <BaomoiText style={{color: '#696969', fontSize: 14}}>{item.taxonomy_source[0].name} - {moment(item.modified).fromNow().replace("trước", "").replace("một", "1")}</BaomoiText>
                                  :
                                      <BaomoiText style={{color: '#696969', fontSize: 14}}>{moment(item.modified).fromNow().replace("trước", "").replace("một", "1")}</BaomoiText>
                                }
                                <Comments id={item.id}/>
                            </View>
                            <BaomoiText style={{fontSize: 17.3, fontWeight: '500',color: ui.textColor}}>{item.title.plaintitle}</BaomoiText>
                        </View>
                        <Image
                            source={{uri :item.thumb || defaultImg}}
                            style={{height: 90, flex: 1, marginLeft: 5, borderRadius: 5}}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}
