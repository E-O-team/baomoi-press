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
import Ad from '../../components/Ad';
export default class OtherCategoriesScreens extends React.PureComponent {
    constructor(props){
        super(props)
        const categories = this.props.navigation.getParam('categories')
        this.state = {
            selectedCategory: categories[0].id,
            categories: categories,
            styles: styles,
            refreshing: true,
            loading: false,
            page: 1
        }
    }

    componentWillMount() {
        this.fetchNews(this.state.selectedCategory)
    }

    fetchNews = (selectedCategory) => {
        console.log("page: " + this.state.page);
        if(this.state.refreshing == true){
            this.setState({
                page: 1,
                articles: [],
            }, () => {
                axios.get("https://baomoi.press/wp-json/wp/v2/posts?categories=" + selectedCategory + "&page=" + this.state.page)
                .then(res => this.setState({
                    articles: [...this.state.articles,...res.data],
                    refreshing: false,
                }))
                // .then(json => console.log(json))
                .catch(err => console.log(err))
            })
        }else{
            axios.get("https://baomoi.press/wp-json/wp/v2/posts?categories=" + selectedCategory + "&page=" + this.state.page)
            .then(res => this.setState({
                articles: [...this.state.articles,...res.data],
                refreshing: false,
            }))
            // .then(json => console.log(json))
            .catch(err => console.log(err))
        }

    }

    handleRefresh = () => {
        this.setState({
                refreshing: true
            },
            () => this.fetchNews(this.state.selectedCategory)
        );
    }

    handleLoadMore = () => {
        console.log("loading more");
        this.setState({
            page: this.state.page + 1,
        }, () => this.fetchNews(this.state.selectedCategory))
    }

    setCategory = (id) => {
        this.setState({
            selectedCategory: id,
            page: 1,
            articles: []
        }, () => {
            this.fetchNews(this.state.selectedCategory);
        })
    }
    render(){
        return(
            <Consumer>
                {({textColor, backGround}) => (
                    <View style={{flex: 1, backgroundColor: backGround}}>
                        <View style={{height: 37}}>
                            <FlatList
                                showsHorizontalScrollIndicator={false}
                                horizontal={true}
                                keyExtractor={item => item.id.toString()}
                                data={this.state.categories}
                                extraData={this.state.selectedCategory}
                                renderItem={({item}) =>
                                <Consumer>
                                {({textColor, backGround}) => (
                                    <TouchableOpacity
                                        onPress={() => this.setCategory(item.id)}
                                        style={{
                                            backgroundColor: backGround,
                                            padding: 10,
                                        }}
                                        underlayColor="white"
                                        activeOpacity={1}
                                    >
                                      {
                                        (item.id === this.state.selectedCategory)?
                                        <View>
                                          <Text style={{color: "red"}}>{item.name}</Text>
                                          <View style={{height: 1, backgroundColor: 'red'}}></View>
                                        </View> : <Text style={{color: textColor}}>{item.name}</Text>
                                      }

                                    </TouchableOpacity>
                                  )}
                                  </Consumer>

                                }
                                keyExtractor={item => item.id.toString()}
                            />
                        </View>
                        <Ad/>
                        <FlatList
                            onScrollBeginDrag={this.handleBeginDrag}
                            onScrollEndDrag={this.handleEndDrag}
                            onScroll={this.handleOnScroll}
                            data={this.state.articles}
                            extraData={this.state.articles}
                            renderItem={({ item, index }) => <Articles item={item} navigation={this.props.navigation} ui={{textColor, backGround}} index={index}/>}
                            keyExtractor={item => item.id.toString()}
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
