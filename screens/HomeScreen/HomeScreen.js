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
import Articles from '../../components/Articles';
import Header from '../../components/Header.js';
import { MonoText } from '../../components/StyledText';
import {Consumer} from '../../context/context.js';
import { BaomoiText } from '../../components/StyledText';
import axios from 'axios';
import moment from 'moment/min/moment-with-locales'
const defaultImg ='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png';
var { width, height } = Dimensions.get('window');


export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: true,
            articles: [],
            categories: [],
            selectedCategory: 'Home',
            loading: false,
            CategoryStyle: style.categories,
            page: 1,
            y: 0,
            isScrollDown: false,

        }
    }
    static navigationOptions = ({navigation}) => {
        return {
            title: "Home",
            header: <Header navigation={navigation}/>
        }
    }
    componentWillMount() {
        this.fetchNews(this.state.selectedCategory)
        this.fetchCategories()
    }
    fetchNews = (selectedCategory) => {
        console.log("page: " + this.state.page);
        if(this.state.refreshing == true){
            this.setState({
                page: 1,
                articles: [],
            })
        }
        // Home
        if(selectedCategory === "Home"){
            if(this.state.page == 1){
                axios.all([
                    axios.get("https://baomoi.press/wp-json/wp/v2/posts?meta_key=ht_featured&meta_value=on"),
                    axios.get("https://baomoi.press/wp-json/wp/v2/posts?page=" + this.state.page)
                ])
                .then(axios.spread((featuredPostRes, articlesRes) => {
                    this.setState({
                        articles: [...this.state.articles, featuredPostRes.data[0], ...articlesRes.data],
                        refreshing: false,
                    })
                }))
                .catch(err => console.log(err))
            }else{
                axios.get("https://baomoi.press/wp-json/wp/v2/posts?page=" + this.state.page)
                .then(res => this.setState({
                    articles: [...this.state.articles, ...res.data],
                }))
            }

        // Other categories
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

    fetchCategories = () => {
        fetch("https://baomoi.press/wp-json/wp/v2/categories")
        .then(res => res.json())
        .then(json => this.setState({
            categories: [{name: "Home", id:"Home", key:"HOME"},...json],
        }))
        .catch(err => console.log(err))
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
            CategoryStyle: style.selectedCategory,
            page: 1,
            articles: []
        }, () => {
            this.fetchNews(this.state.selectedCategory);
            this.fetchCategories();
        })
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
    render() {
        return(
            <Consumer>
                {({textColor, backGround}) => (
                    <View style={{flex: 1, backgroundColor: backGround}}>



                        <Consumer>
                        {({textColor, backGround}) => (
                            <FlatList
                                onScrollBeginDrag={this.handleBeginDrag}
                                onScrollEndDrag={this.handleEndDrag}
                                onScroll={this.handleOnScroll}
                                data={this.state.articles}
                                renderItem={({ item, index }) => <Articles item={item} navigation={this.props.navigation} ui={{textColor, backGround}} index={index}/>}
                                keyExtractor={item => item.id.toString()}
                                refreshing={this.state.refreshing}
                                onRefresh={this.handleRefresh}
                                onEndReached={() => this.handleLoadMore()}
                                onEndReachedThreshold={0.7}
                            />
                      )}
                      </Consumer>
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

// <View style={{height: 37}}>
//     <FlatList
//         showsHorizontalScrollIndicator={false}
//         horizontal={true}
//         keyExtractor={item => item.id.toString()}
//         data={this.state.categories}
//         renderItem={({item}) =>
//         <Consumer>
//         {({textColor, backGround}) => (
//             <TouchableOpacity
//                 onPress={() => this.setCategory(item.id)}
//                 style={{backgroundColor: backGround,
//                         padding: 10,}}
//                 underlayColor="white"
//                 activeOpacity={1}
//             >
//               {
//                 (item.id === this.state.selectedCategory)?
//                 <View>
//                   <Text style={{color: "red"}}>{item.name}</Text>
//                   <View style={{height: 1, backgroundColor: 'red'}}></View>
//                 </View> : <Text style={{color: textColor}}>{item.name}</Text>
//               }
//
//             </TouchableOpacity>
//           )}
//           </Consumer>
//
//         }
//         keyExtractor={item => item.id.toString()}
//     />
// </View>
