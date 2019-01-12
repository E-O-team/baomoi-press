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

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: true,
            articles: [],
            categories: [],
            selectedCategory: 'Home'
        }
    }
    static navigationOptions = {
        title: "Home",
        header: <Header/>
    };

    componentWillMount() {
        this.fetchNews(this.state.selectedCategory)
    }
<<<<<<< HEAD

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
=======
    fetchNews = () => {
        fetch("https://baomoi.press/wp-json/wp/v2/posts?per_page=15")
>>>>>>> kien
        .then(res => res.json())
        .then(json => this.setState({
            categories: json
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
        console.log(id);
        this.setState({
            selectedCategory: id
        }, () => {
            this.fetchNews(this.state.selectedCategory);
        })

    }
    render() {
        return(
<<<<<<< HEAD
            <View style={{flex: 1}}>
                <View style={{height: 35}}>
                    <FlatList

                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        data={this.state.categories}
                        renderItem={({item}) =>
                            <TouchableHighlight
                                onPress={() => this.setCategory(item.id)}
                                style={{padding: 10, backgroundColor:"gray" }}
                                underlayColor="blue"
                                activeOpacity={0}
                            >
                                <Text>{item.name}</Text>
                            </TouchableHighlight>}
                        keyExtractor={item => item.slug}
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
                    <FlatList
                        data={this.state.articles}
                        renderItem={({ item }) => <Articles item={item} navigation={this.props.navigation}/>
                        }
                        keyExtractor={item => item.slug}
                        refreshing={this.state.refreshing}
                        onRefresh={this.handleRefresh}
                    />
                </View>
=======
            <View>
                <FlatList
                    data={this.state.articles}
                    renderItem={({ item }) =>
                        <Tile
                            activeOpacity={1}
                            onPress={() => this.props.navigation.navigate("Article", {
                                Article: item
                            })}
                            title={item.title.rendered}
                            titleStyle={{textAlign: "left"}}
                            imageSrc={{uri : item.thumb}}
                            featured

                            containerStyle={{backgroundColor: "white"}}
                        >
                        </Tile>
                    }
                    keyExtractor={item => item.slug}
                    refreshing={this.state.refreshing}
                    onRefresh={this.handleRefresh}
                />
>>>>>>> kien
            </View>

        )
    }
}
// onRefresh={this.handleRefresh}
// renderItem={({item}) => <Button onPress={() => this.setCategory(item.id)} title={item.name}/>
