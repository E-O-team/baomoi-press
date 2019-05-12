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
import Header from '../../components/Header';
import axios from 'axios';
import {Consumer} from '../../context/context.js';
import Articles from '../../components/Articles/Articles';
export default class OtherCategoriesScreens extends React.PureComponent {
    constructor(props){
        super(props)
        const categories = this.props.navigation.getParam('categories')
        const category_id_arr = categories.map(category => category.id)
        this.state = {
            categories:  category_id_arr,
            styles: styles,
            refreshing: true,
            loading: false,
            page: 1,
            y: 0,
            isScrollDown: false,
        }
    }

    componentDidMount() {
        this.cancelTokenSource = axios.CancelToken.source()
        this.fetchNews()
    }

    fetchNews = () => {

        if(this.state.refreshing == true){
            this.setState({
                page: 1,
                articles: [],
            }, () => {
                axios.get("https://baomoi.press/wp-json/wp/v2/posts?categories=" + this.state.categories.toString() + "&per_page=10&page=" + this.state.page, {
                    cancelToken: this.cancelTokenSource.token,
                })
                .then(res => this.setState({
                    articles: [...this.state.articles,...res.data],
                    refreshing: false,
                }))
                // .then(json => console.log(json))
                .catch(err => {
                    if(axios.isCancel(err)){
                        return
                    }else{
                        console.log(err)
                    }
                })
            })
        }else{
            axios.get("https://baomoi.press/wp-json/wp/v2/posts?categories=" + this.state.categories.toString() + "&per_page=10&page=" + this.state.page, {
                cancelToken: this.cancelTokenSource.token,
            })
            .then(res => this.setState({
                articles: [...this.state.articles,...res.data],
                refreshing: false,
            }))
            // .then(json => console.log(json))
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

    renderItem = ({ item, index }) => ( <Articles item={item} navigation={this.props.navigation} index={index} ui={{textColor: 'black', backGround:'white'}}/>);

    keyExtractor = (item, index) => item.id.toString()

    handleRefresh = () => {
        this.setState({
                refreshing: true,
                page: 1
            },
            () => this.fetchNews(this.state.selectedCategory)
        );
    }

    handleLoadMore = () => {
        this.setState({
            page: this.state.page + 1,
        }, () => this.fetchNews(this.state.selectedCategory))
    }

    handleOnScroll = (e) => {
      this.setState({y: e.nativeEvent.contentOffset.y})
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
    }
    render(){
        return(
            <Consumer>
                {({textColor, backGround}) => (
                    <View style={{flex: 1, backgroundColor: backGround}}>
                            <FlatList
                                onScroll={this.handleOnScroll}
                                data={this.state.articles}
                                extraData={this.state.articles}
                                scrollEventThrottle={16}
                                initialNumToRender={5}
                                removeClippedSubviews={true}
                                windowSize={15}
                                renderItem={this.renderItem}
                                keyExtractor={this.keyExtractor}
                                refreshing={this.state.refreshing}
                                onRefresh={this.handleRefresh}
                                onEndReached={() => this.handleLoadMore()}
                                onEndReachedThreshold={0.7}
                            />
                   </View>
                )}
            </Consumer>
        )
    }
}
