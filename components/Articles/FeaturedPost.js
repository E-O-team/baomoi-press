import React from 'react';
import {
    TouchableOpacity,
    View,
    Image,
    Dimensions,
    FlatList,
} from 'react-native';
import { Divider, Icon } from 'react-native-elements';
import {Consumer} from '../../context/context.js'
import { BaomoiText } from '../StyledText';
import moment from 'moment/min/moment-with-locales'
import spinner from '../../assets/images/spinner.gif';
var { width, height } = Dimensions.get('window');

moment.locale('vi');
const defaultImg ='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png';

export default class FeaturedPost extends React.Component {
    render(){
        const item = this.props.item
        const ui = this.props.ui
        const index = this.props.index
        return(
            <View>
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => this.props.navigation.navigate("Article", {
                        Article: item
                    })}
                >
                    <View style={{flexDirection: "row", justifyContent: 'space-between', padding: 10, alignItems: "center"}}>
                        <View style={{flexDirection: 'row', alignItems:'center'}}>
                            <View style={{backgroundColor: 'red', width: 8, height: 8, borderRadius: 5, marginBottom: 3}}></View>
                            <BaomoiText style={{fontWeight: "bold",marginLeft:5, color: ui.textColor, fontSize: 20}}>Tiêu Điểm</BaomoiText>
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
                                     <BaomoiText style={{color: '#696969', fontSize: 15}}>{item.taxonomy_source[0].name} - {moment(item.modified).fromNow()}</BaomoiText>
                                  :
                                      <BaomoiText style={{color: '#696969', fontSize: 15}}>{moment(item.modified).fromNow()}</BaomoiText>
                                }
                                <Comments id={item.id}/>
                            </View>
                            <BaomoiText style={{fontSize: 22, fontWeight: '500', color: ui.textColor}}>{item.title.plaintitle}</BaomoiText>
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={{padding: 10}}>
                    <FlatList
                        data={item.otherFeaturedPosts}
                        renderItem={({ item, index }) =>
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate("Article", {
                                    Article: item
                                })}
                                key={item.id}
                                activeOpacity={0.8}
                            >
                                <View style={{flexDirection: "row", marginBottom: 3, alignItems: "flex-start"}}>
                                    <Icon
                                        type="entypo"
                                        name="dot-single"
                                    />
                                <BaomoiText style={{fontSize: 16, textAlign: "justify", color: '#696969', marginLeft: 5,flex: 1, flexWrap: 'wrap'}}>{item.title.plaintitle}</BaomoiText>
                                </View>
                            </TouchableOpacity>
                        }
                        keyExtractor={item => item.id.toString()}
                    />
                </View>
            </View>
        )
    }
}
