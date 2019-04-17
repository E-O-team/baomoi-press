import React from 'react';
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
    Button,
    TouchableHighlight,
    Dimensions,
    AsyncStorage,
    ActivityIndicator,
} from 'react-native';

import { ListItem, List, Tile, Card, Divider, Icon } from 'react-native-elements'
import {
    WebBrowser
} from 'expo';
import Articles from '../../components/Articles/Articles';
import Header from '../../components/Header.js';
import { MonoText } from '../../components/StyledText';
import {Consumer} from '../../context/context.js';
import { BaomoiText } from '../../components/StyledText';
import axios from 'axios';
import { FacebookAds } from 'expo';

import moment from 'moment/min/moment-with-locales'
import InterstitialAd from '../../components/Ads/InterstitialAd';
const defaultImg ='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png';
var { width, height } = Dimensions.get('window');


export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: true,
            articles: [],
            page: 1,
            y: 0,
            isScrollDown: false,
        }
    }
    // static navigationOptions = ({navigation}) => {
    //     return {
    //         title: "Home",
    //         header: <Header navigation={navigation}/>
    //     }
    // }
    componentWillMount() {
        this.fetchNews()
        // this.fetchCategories()
    }
    fetchNews = () => {
        this.cancelTokenSource = axios.CancelToken.source()
        if(this.state.refreshing == true){
            this.setState({
                page: 1,
                articles: [],
            })
        }
        // Home
            if(this.state.page == 1){
                axios.all([
                    axios.get("https://baomoi.press/wp-json/wp/v2/posts?meta_key=ht_featured&meta_value=on&per_page=4",{
                        cancelToken: this.cancelTokenSource.token
                    }),
                    axios.get("https://baomoi.press/wp-json/wp/v2/posts?page=" + this.state.page,{
                        cancelToken: this.cancelTokenSource.token
                    })
                ])
                .then(axios.spread((featuredPostRes, articlesRes) => {
                    const featuredPost = Object.create(featuredPostRes.data[0])
                    featuredPost.otherFeaturedPosts = [featuredPostRes.data[1], featuredPostRes.data[2], featuredPostRes.data[3]]
                    this.setState({
                        articles: [...this.state.articles, featuredPost, ...articlesRes.data],
                        refreshing: false,
                    })
                }))
                .catch(err => {
                    if(axios.isCancel(err)){
                        return
                    }else{
                        console.log(err)
                    }
                })
            }else{
                axios.get("https://baomoi.press/wp-json/wp/v2/posts?page=" + this.state.page,{
                    cancelToken: this.cancelTokenSource.token
                })
                .then(res => this.setState({
                    articles: [...this.state.articles, ...res.data],
                }))
                .catch(err => {
                    if(axios.isCancel(err)){
                        return
                    }else{
                        console.log(err)
                    }
                })
            }
    }

    componentWillUnmount() {
        this.cancelTokenSource && this.cancelTokenSource.cancel()
    }

    handleRefresh = () => {
        this.setState({
                refreshing: true,
                page: 1
            },
            () => this.fetchNews()
        );
    }
    handleLoadMore = () => {
        this.setState({
            page: this.state.page + 1,
        }, () => this.fetchNews())
    }

    setCategory = (id) => {
        this.setState({
            selectedCategory: id,
            page: 1,
            articles: []
        }, () => {
            this.fetchNews();
            // this.fetchCategories();
        })
    }

    handleOnScroll = (e) => {
        if(this.state.y != 0){
           if(this.state.y > e.nativeEvent.contentOffset.y && this.state.isScrollDown) {
             this.props.navigation.setParams({ visible: true })
             this.setState({isScrollDown : false})
           }
           if(this.state.y < e.nativeEvent.contentOffset.y && !this.state.isScrollDown) {

             this.props.navigation.setParams({ visible: false })
             this.setState({isScrollDown : true})
           }
        }
        this.setState({y: e.nativeEvent.contentOffset.y})

    }
    render() {
        return(
            <Consumer>
                {({textColor, backGround}) => (
                    <View style={{flex: 1, backgroundColor: backGround}}>
                        <InterstitialAd AdPosition="Khởi động ứng dụng"/>
                        <FlatList
                            onScroll={this.handleOnScroll}
                            initialNumToRender={5}
                            data={this.state.articles}
                            extraData={this.state.articles}
                            renderItem={({ item, index }) => <Articles item={item} navigation={this.props.navigation} ui={{textColor, backGround}} index={index}/>}
                            keyExtractor={(item, index) => index.toString()}
                            refreshing={this.state.refreshing}
                            onRefresh={this.handleRefresh}
                            onEndReached={() => this.handleLoadMore()}
                            onEndReachedThreshold={0.5}
                            scrollEventThrottle={16}
                        />
                  </View>
                )}
            </Consumer>
        )
    }
}

const style = StyleSheet.create({
    categories:{
        backgroundColor: 'white',
        padding: 10,
    },
    featuredPost:{
        padding: 10,
        backgroundColor: "white",
    },
    featuredPostTitle:{
        fontSize: 30,
    },
    selectedCategory:{
        backgroundColor: 'white',
        padding: 10,
    },
})
