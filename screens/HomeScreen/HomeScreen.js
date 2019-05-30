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
import { FacebookAds, Notifications} from 'expo';
import NotificationPopup from 'react-native-push-notification-popup';
import moment from 'moment/min/moment-with-locales'
import dateFormat from 'dateformat';
import InterstitialAd from '../../components/Ads/InterstitialAd';
const defaultImg ='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png';
var { width, height } = Dimensions.get('window');
import Post1Pic from '../../components/Articles/Post1Pic'

var scrollPosition = 0;

const ITEM_HEIGHT = 200
export default class HomeScreen extends React.Component {
    _scrollPosition = 0
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
    componentDidMount() {
        this.fetchNews()
        this.notificationSubscription = Notifications.addListener(this._handleNotification);
        FacebookAds.AdSettings.clearTestDevices();
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
                axios.get("https://baomoi.press/wp-json/wp/v2/posts?meta_key=ht_featured&meta_value=off&page=" + this.state.page,{
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

    _handleNotification = notification => {
        const {title, body, slug} = notification.data
        const findArticleFunc = this.findNotificationArticle
        this.popup.show({
            onPress: function() {findArticleFunc(slug)},
            appIconSource: require('../../assets/images/logo-256x256.png'),
            appTitle: 'Baomoi.press',
            timeText: dateFormat(new Date(), "dd-mm-yyyy"),
            title: title,
            body: body,
        });
        if(notification.origin === 'selected') findArticleFunc(slug)
    };

    findNotificationArticle = (slug) => {
        axios.get("https://baomoi.press/wp-json/wp/v2/posts?slug=" + slug,{
            cancelToken: this.cancelTokenSource.token
        })
        .then(res => {
                if(res.data[0]){
                    this.props.navigation.navigate("Article", {
                                       Article: res.data[0]
                                   })
                }
        })
        .catch(err => console.log(err))
    }

    componentWillUnmount() {
        console.log('Home unmounted')
        this.cancelTokenSource && this.cancelTokenSource.cancel()
        this.notificationSubscription.remove()
    }

    handleOnScroll = (e) => {
        if(this._scrollPosition != 0){
           if(this._scrollPosition > e.nativeEvent.contentOffset.y && this.state.isScrollDown) {
             this.props.navigation.setParams({ visible: true })
             this.setState({isScrollDown : false})
           }
           if(this._scrollPosition < e.nativeEvent.contentOffset.y && !this.state.isScrollDown) {

             this.props.navigation.setParams({ visible: false })
             this.setState({isScrollDown : true})
           }
        }
        this._scrollPosition =  e.nativeEvent.contentOffset.y

    }


    renderItem = ({ item, index }) => ( <Articles item={item} navigation={this.props.navigation} index={index} ui={{textColor: 'black', backGround:'white'}}/>);

    keyExtractor = (item, index) => item.id.toString()

    handleRefresh = () => {
        this.setState({
                refreshing: true,
                page: 1
            },
            () => this.fetchNews()
        );
    }

    handleLoadMore = () => {
        console.log("loading more");
        this.setState({
            page: this.state.page + 1,
        }, () => this.fetchNews())
    }

    render() {
        return(
            <Consumer>
                {({textColor, backGround}) => (
                    <View style={{
                      flex: 1,
                      backgroundColor: backGround
                    }}>
                        <InterstitialAd AdPosition="Khởi động ứng dụng"/>
                        <NotificationPopup ref={ref => this.popup = ref} />
                        <FlatList
                            onScroll={this.handleOnScroll}
                            scrollEventThrottle={16}
                            initialNumToRender={5}
                            data={this.state.articles}
                            extraData={this.state.articles}
                            renderItem={this.renderItem}
                            keyExtractor={this.keyExtractor}
                            refreshing={this.state.refreshing}
                            onRefresh={this.handleRefresh}
                            removeClippedSubviews={true}
                            windowSize={15}
                            onEndReached={() => this.handleLoadMore()}
                            onEndReachedThreshold={0.5}

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
