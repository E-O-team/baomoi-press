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
} from 'react-native';

import { ListItem, List, Tile, Card, Divider, Icon } from 'react-native-elements';
import HTMLView from 'react-native-htmlview';
import {
    WebBrowser
} from 'expo';
import { MonoText } from './StyledText';
const defaultImg ='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png';
export default class Articles extends React.PureComponent {
    constructor(props){
        super(props);
        this.state={
            numberOfComments: 'loading',
            featured_post: undefined,
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
        return nextState.numberOfComments !== this.state.numberOfComments
    }
    render(){
        Comments = (props) => {
            if(this.state.numberOfComments !== 0){
                return(
                    <View style={{flexDirection: "row", justifyContent: 'flex-end'}}><Text>{this.state.numberOfComments} </Text><Icon name='comment' color='#696969'/></View>
                )
            }else{
                return null;
            }
        }

        // check to see if the post have more than 3 pic
        Post = (prop) => {
            const item = prop.item
            if(this.props.video == true){
                // post with video format
                return(
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => this.props.navigation.navigate("Article", {
                            Article: item
                        })}
                    >
                        <View style={{flex: 1, flexDirection: "column", justifyContent: 'center'}}>
                            <View>
                                <Tile
                                    imageSrc={{uri :item.thumb || defaultImg}}
                                    icon={{ name: 'play-circle', type: 'font-awesome', color: "white", size: 45 }}
                                    featured
                                    onPress={() => this.props.navigation.navigate("Article", {
                                        Article: item
                                    })}
                                />
                            </View>
                            <View style={{padding: 10}}>
                                <Text style={{fontSize: 20, fontWeight: '500'}}>{item.title.plaintitle}</Text>
                            </View>
                        </View>

                        <Text style={{fontSize:18, color: '#696969', marginTop:10}} numberOfLines={3}>{item.excerpt.plainexcerpt}</Text>
                    </TouchableOpacity>
                )
            }else{
                if(item.featured_post == "on"){
                    return(
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => this.props.navigation.navigate("Article", {
                                Article: item
                            })}
                        >
                            <Text style={{fontWeight: "bold"}}>Tin Nổi Bật </Text>
                            <View style={{marginTop: 5}}>
                                <Image
                                    source={{uri: item.thumb}}
                                    style= {{height: 180, width: 340, marginLeft: 10}}
                                />
                                <Text style={{fontSize: 20, fontWeight: '500'}}>{item.title.plaintitle}</Text>
                                <Text style={{fontSize:18, color: '#696969', marginTop:10}} numberOfLines={3}>{item.excerpt.plainexcerpt}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }else{
                    if (item.content.images.length >= 3){
                        // post with more than 3 pic
                        return(
                            <View style={{flex: 1, flexDirection: 'column'}}>
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
                                                source={{uri: item.content.images[0]}}
                                                style= {{height: 80, marginLeft: 5,}}
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
                                                source={{uri: item.content.images[1]}}
                                                style= {{height: 80, marginLeft: 5}}
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
                                                source={{uri: item.content.images[2]}}
                                                style= {{height: 80, marginLeft: 5}}
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
                                        <Text style={{fontSize: 22, fontWeight: '500'}}>{item.title.plaintitle}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    }else {
                        // post with less than 3 pic
                        return(
                            <View>
                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    onPress={() => this.props.navigation.navigate("Article", {
                                        Article: item
                                    })}
                                >
                                    <View style={{flex: 1, flexDirection: "row"}}>
                                        <View style={{flex: 2}}>
                                            <Text style={{fontSize: 20, fontWeight: '500'}}>{item.title.plaintitle}</Text>
                                        </View>
                                        <Image
                                            source={{uri :item.thumb || defaultImg}}
                                            style={{height: 80, flex: 1, marginLeft: 5}}
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
        return(
            <View style={{padding: 10, backgroundColor: "white"}}>
                    <Post item={item}/>
                    <Comments id={item.id}/>
                    <Text style={{color: '#696969'}}>VnExpress - 2 giờ trước</Text>
                <Divider style={{ backgroundColor: '#e0e0e0', marginTop: 10 }} />
            </View>
        )
    }
}
