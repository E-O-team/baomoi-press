import React from 'react';
// import Articles from './Articles';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    SafeAreaView,
    Dimensions
} from 'react-native';

import { ListItem, List, Tile, Card, Divider, Icon } from 'react-native-elements';
import HTMLView from 'react-native-htmlview';
import {Consumer} from '../context/context.js'
import {
    WebBrowser
} from 'expo';
import { BaomoiText } from './StyledText';
import moment from 'moment/min/moment-with-locales'
import spinner from '../assets/images/spinner.gif';
const defaultImg ='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png';
var { width, height } = Dimensions.get('window');
moment.locale('vi');

export default class Articles extends React.Component {
    constructor(props){
        super(props);
        this.state={
            numberOfComments: 0
        }
    }
    componentDidMount() {
        fetch('https://baomoi.press/wp-json/wp/v2/comments?post=' + this.props.item.id)
        .then(res => res.json())
        .then(json => this.setState({
            numberOfComments: json.length,
        }))
    }
    shouldComponentUpdate(nextProps, nextState) {
        if(this.state.numberOfComments !== nextState.numberOfComments){
            return true
        }
        if(this.props.item !== nextProps.item){
            return true
        }
        return false
    }
    render(){
        Comments = (props) => {
            if(this.state.numberOfComments !== 0){
                return(
                  <View style={{flexDirection: "row"}}><BaomoiText style={{color: '#696969', fontSize: 15}}> - {this.state.numberOfComments} </BaomoiText><Icon name='comment' color='#696969' size={15}/></View>
                )
            }else{
                return null;
            }

        }

        Post = (prop) => {
            const item = prop.item
            const ui = prop.ui
            const index = prop.index
            if(this.props.video == true){
                // post with video format
                return(
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => this.props.navigation.navigate("Article", {
                            Article: item
                        })}
                    >
                        <View style={{flex: 1, flexDirection: "column", justifyContent: 'center'}}>
                            <View style={{alignItems: 'center'}}>
                                <Tile
                                    activeOpacity={1}
                                    imageSrc={{uri :item.thumb || defaultImg}}
                                    icon={{ name: 'play-circle', type: 'font-awesome', color: "white", size: 45 }}
                                    featured
                                    onPress={() => this.props.navigation.navigate("Article", {
                                        Article: item
                                    })}
                                />
                            </View>
                            <View>
                                <BaomoiText style={{fontSize: 20, fontWeight: '700', fontFamily: 'baomoi-regular', color: ui.textColor}}>{item.title.plaintitle}</BaomoiText>
                            </View>
                        </View>

                        <BaomoiText style={{fontSize:18, color: '#696969', marginTop:10}} numberOfLines={3}>{item.excerpt.plainexcerpt}</BaomoiText>
                    </TouchableOpacity>
                )
            }else{
                if(item.featured_post == "on"){
                    if(index === 0){
                        return(
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => this.props.navigation.navigate("Article", {
                                    Article: item
                                })}
                            >
                                <View style={{flexDirection: "row", justifyContent: 'space-between', padding: 10}}>
                                    <View style={{flexDirection: 'row', alignItems:'center'}}>
                                        <View style={{backgroundColor: 'red', width: 8, height: 8, borderRadius: 5, marginBottom: 3}}></View>
                                        <BaomoiText style={{fontWeight: "bold",marginLeft:5, color: ui.textColor, fontSize: 20}}>Tiêu Điểm</BaomoiText>
                                    </View>
                                    <Icon
                                        size={30}
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
                                            <BaomoiText style={{color: '#696969', fontSize: 15}}>{item.taxonomy_source[0].name} - {moment(item.modified).fromNow()}</BaomoiText>
                                            <Comments id={item.id}/>
                                        </View>
                                        <BaomoiText style={{fontSize: 22, fontWeight: '500', color: ui.textColor}}>{item.title.plaintitle}</BaomoiText>
                                        <BaomoiText style={{fontSize:18, color: '#696969', marginTop:10}}>{item.excerpt.plainexcerpt}</BaomoiText>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    }else{
                        // return null after first render of featured post
                        return null
                    }
                }else{
                    if (item.content.images.length >= 3){
                        // post with more than 3 pic
                        return(
                            <View style={{flex: 1, flexDirection: 'column', padding: 10}}>
                                <View style={{flex: 2}}>
                                    <View style={{flexDirection: "row"}}>
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
                                        <BaomoiText style={{color: '#696969', fontSize: 15}}>{item.taxonomy_source[0].name} - {moment(item.modified).fromNow()}</BaomoiText>
                                        <Comments id={item.id}/>
                                    </View>
                                        <BaomoiText style={{fontSize: 20, fontWeight: '500', color: ui.textColor}} numberOfLines={3}>{item.title.plaintitle}</BaomoiText>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    }else {
                        // post with less than 3 pic
                        return(
                            <View style={{padding: 10}}>
                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    onPress={() => this.props.navigation.navigate("Article", {
                                        Article: item
                                    })}
                                >
                                    <View style={{flex: 1, flexDirection: "row", alignItems:'center'}}>
                                        <View style={{flex: 2}}>
                                            <View style={{flexDirection: "row", alignItems:'center'}}>
                                                <BaomoiText style={{color: '#696969', fontSize: 15}}>{item.taxonomy_source[0].name} - {moment(item.modified).fromNow()}</BaomoiText>
                                                <Comments id={item.id}/>
                                            </View>
                                            <BaomoiText style={{fontSize: 20, fontWeight: '500',color: ui.textColor}}>{item.title.plaintitle}</BaomoiText>
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

            }
        }
        const item = this.props.item
        const index = this.props.index
        return(
          <Consumer>
            {({textColor, backGround}) => (
            <View style={{backgroundColor: backGround}}>
                    <Post item={item} ui={{textColor}} index={index}/>

                <Divider style={{ backgroundColor: '#e0e0e0', marginTop: 10 }} />
            </View>
          )}
          </Consumer>
        )
    }
}
