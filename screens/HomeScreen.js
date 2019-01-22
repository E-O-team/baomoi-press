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
    Button,
    TouchableHighlight,
    Dimensions,
    AsyncStorage,
} from 'react-native';

import { ListItem, List, Tile, Card, Divider, Icon } from 'react-native-elements'
import {
    WebBrowser
} from 'expo';
import Articles from '../components/Articles';
import Header from '../components/Header.js';
import { MonoText } from '../components/StyledText';
import axios from 'axios';

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
            CategoryStyle: style.categories

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
        // Home
        if(selectedCategory === "Home"){
            axios.get("https://baomoi.press/wp-json/wp/v2/posts?page=" + this.state.page)
            .then(res => this.setState({
                articles: [...this.state.articles,...res.data],
                refreshing: false,
            }))
            // .then(json => console.log(json))
            .catch(err => console.log(err))
        // Other categories
        }else{
            fetch("https://baomoi.press/wp-json/wp/v2/posts?categories=" + selectedCategory + "&page=" + this.state.page)
            .then(res => res.json())
            .then(json => this.setState({
                articles: json,
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
        }, () => {
            this.fetchNews(this.state.selectedCategory);
        })

    }
    handleBeginDrag = (e) =>{
      this.setState({y: e.nativeEvent.contentOffset.y})
      if(this.state.y != 0){
        if(this.state.isScrollDown) this.props.navigation.setParams({ visible: false })
      }
    }
    handleEndDrag = (e) =>{
      this.setState({y: e.nativeEvent.contentOffset.y})
      if(e.nativeEvent.contentOffset.y <= this.state.y)
      {
        this.props.navigation.setParams({ visible: true })
        this.setState({isScrollDown : false})
      }else{
        this.setState({isScrollDown: true})
      }
    }
    render() {
        return(
            <View style={{flex: 1}}>
                <View style={{height: 37}}>
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        data={this.state.categories}
                        renderItem={({item}) =>
                            <TouchableHighlight
                                onPress={() => this.setCategory(item.id)}
                                style={this.state.CategoryStyle}
                                underlayColor="white"
                                activeOpacity={1}
                            >
                                <Text style={{color: "white"}}>{item.name}</Text>
                            </TouchableHighlight>}
                        keyExtractor={item => item.id.toString()}
                    />
                </View>
                <View>
                    <FlatList
                        onScrollBeginDrag={this.handleBeginDrag}
                        onScrollEndDrag={this.handleEndDrag}
                        data={this.state.articles}
                        renderItem={({ item }) => <Articles item={item} navigation={this.props.navigation}/>
                        }
                        keyExtractor={item => item.id.toString()}
                        refreshing={this.state.refreshing}
                        onRefresh={this.handleRefresh}
                    />
                </View>
          </View>


        )
    }
}

const style = StyleSheet.create({
    categories:{
        backgroundColor: '#e12f28',
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
        backgroundColor: 'blue',
        padding: 10,
    },
})

// onRefresh={this.handleRefresh}
// renderItem={({item}) => <Button onPress={() => this.setCategory(item.id)} title={item.name}/>
