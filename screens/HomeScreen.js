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
} from 'react-native';

import { ListItem, List, Tile, Card, Divider, Icon } from 'react-native-elements'
import {
    WebBrowser
} from 'expo';
import Articles from '../components/Articles';
import Header from '../components/Header.js';
import { MonoText } from '../components/StyledText';
import axios from 'axios';
export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: true,
            articles: [],
            categories: [],
            selectedCategory: 'Home',
            CategoryStyle: style.categories,
            featuredPost: "",
        }
    }
    static navigationOptions = ({navigation}) => {
        return {
            title: "Home",
            header: <Header navigation={navigation}/>
        }
    }
    componentWillMount() {
        this.fetchFeaturedPost()
        this.fetchNews(this.state.selectedCategory)
    }

    fetchFeaturedPost = () => {
        axios.get("https://baomoi.press/wp-json/wp/v2/posts?meta_key=ht_featured&meta_value=on")
        .then(res => this.setState({
            featuredPost: res.data[0]
        }))
        .catch(err => console.log(err))
    }

    fetchNews = (selectedCategory) => {
        // Home
        if(selectedCategory === "Home"){
            fetch("https://baomoi.press/wp-json/wp/v2/posts")
            .then(res => res.json())
            .then(json => this.setState({
                articles: json,
                refreshing: false,
            }))
            // .then(json => console.log(json))
            .catch(err => console.log(err))
        // Other categories
        }else{
            fetch("https://baomoi.press/wp-json/wp/v2/posts?categories=" + selectedCategory)
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

    componentDidMount() {
        this.fetchCategories()
    }
    handleRefresh = () => {
        this.setState({
                refreshing: true
            },
            () => this.fetchNews(this.state.selectedCategory)
        );
    }

    setCategory = (id) => {
        this.setState({
            selectedCategory: id,
            CategoryStyle: style.selectedCategory
        }, () => {
            this.fetchNews(this.state.selectedCategory);
        })

    }
    render() {
        const FeaturedPost = (props) => {
            const featuredPost = props.featuredPost
            if(featuredPost !== ""){
                return(
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => this.props.navigation.navigate("Article", {
                            Article: featuredPost
                        })}
                    >
                        <Text style={{fontSize: 20, fontWeight: "bold", marginBottom: 5}}>Tin Nóng</Text>
                        <Image
                            source={{uri: featuredPost.thumb}}
                            style= {{height: 180, width: 340, marginLeft: 10}}
                        />
                        <Text style={style.featuredPostTitle}>{featuredPost.title.plaintitle}</Text>
                        <Text numberOfLines={2} style={{fontSize: 20, color: '#696969', marginTop:10, marginBottom: 10}} >{featuredPost.excerpt.plainexcerpt}</Text>
                        <Divider style={{ backgroundColor: '#e0e0e0' }} />
                    </TouchableOpacity>
                )
            }else{
                return <Text>Loading</Text>
            }
        }
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

                <View
                    style={{
                        flex: 5,
                        flexDirection: 'column',
                        contentContainer: {
                            alignItems: 'stretch',
                        }
                    }}
                >
                    <ScrollView>
                        <View style={style.featuredPost}>
                            <FeaturedPost featuredPost={this.state.featuredPost}/>
                        </View>
                        <FlatList
                            data={this.state.articles}
                            renderItem={({ item }) => <Articles item={item} navigation={this.props.navigation}/>
                            }
                            keyExtractor={item => item.slug}
                            refreshing={this.state.refreshing}
                            onRefresh={this.handleRefresh}
                        />
                    </ScrollView>
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
