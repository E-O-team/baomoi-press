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
export default class Articles extends React.Component {
    constructor(props){
        super(props);
        this.state={
            numberOfComments: 'loading',
            featured_post: undefined,
            title: ''
        }
    }
    componentWillMount() {
        this.setState({
            featured_post: this.props.item.featured_post,
            title: "<h4>"+this.props.item.title.rendered+"</h4>"
        })
    }
    componentDidMount() {
        fetch('https://baomoi.press/wp-json/wp/v2/comments?post=' + this.props.item.id)
        .then(res => res.json())
        .then(json => this.setState({
            numberOfComments: json.length,
        }))
    }
    render(){
        Comments = (props) => {
            return(
                <View style={{flexDirection: "row", justifyContent: 'flex-end', marginTop: 5}}><Text>{this.state.numberOfComments} </Text><Icon name='comment'/></View>
            )
        }

        // check to see if the post is featured
        Post = (prop) => {
            const item = prop.item

            if (item.content.images.length >= 3){
                // post with more than 3 pic
                return(
                    <View style={{flex: 1, flexDirection: 'column'}}>
                        <View style={{flex: 2}}>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => this.props.navigation.navigate("Article", {
                                        Article: item
                                    })}
                                >
                                    <Image
                                        source={{uri: item.content.images[0]}}
                                        style= {{height: 180, width: 340, marginLeft: 10}}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => this.props.navigation.navigate("Article", {
                                        Article: item
                                    })}
                                >
                                    <Image
                                        source={{uri: item.content.images[1]}}
                                        style= {{height: 180, width: 340, marginLeft: 10}}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => this.props.navigation.navigate("Article", {
                                        Article: item
                                    })}
                                >
                                    <Image
                                        source={{uri: item.content.images[2]}}
                                        style= {{height: 180, width: 340, marginLeft: 10}}
                                    />
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                        <View style={{flex: 1}}>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => this.props.navigation.navigate("Article", {
                                    Article: item
                                })}
                            >
                                <HTMLView value={this.state.title}/>
                                <Text numberOfLines={2} style={{fontSize: 20, color: '#696969'}} >{item.excerpt.plainexcerpt}</Text>
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
                                    <HTMLView value={this.state.title}/>
                                </View>
                                <Image
                                    source={{uri :item.thumb || defaultImg}}
                                    style={{height: 80, width: 180, flex: 1}}
                                />
                            </View>
                            <Text numberOfLines={3} style={{fontSize: 20, color: '#696969'}} >{item.excerpt.plainexcerpt}</Text>
                        </TouchableOpacity>
                    </View>
                )
            }
        }
        FeaturedPost = (prop) => {
            const item = prop.item
            return(
                <Text>bitch this post is featured</Text>
            )
        }
        const item = this.props.item
        return(
            <View style={{padding: 10, backgroundColor: "white"}}>
                    <Post item={item}/>
                    <Comments id={item.id}/>
                <Divider style={{ backgroundColor: '#e0e0e0' }} />
            </View>
        )
    }
}
