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
} from 'react-native';

import { ListItem, List, Tile, Card, Divider, Icon } from 'react-native-elements'
import {
    WebBrowser
} from 'expo';
import Articles from '../components/Articles';
import Header from '../components/Header.js';
import { MonoText } from '../components/StyledText';
var { width, height } = Dimensions.get('window');

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: true,
            articles: [],
            categories: [],
            selectedCategory: 'Home',
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
        console.log(id);
        this.setState({
            selectedCategory: id,
            CategoryStyle: style.selectedCategory
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
                <View style={{height: 35}}>
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
                                <Text>{item.name}</Text>
                            </TouchableHighlight>}
                        keyExtractor={item => item.id.toString()}
                    />
                </View>
                <ScrollView onScrollBeginDrag={this.handleBeginDrag} onScrollEndDrag={this.handleEndDrag}
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
                </ScrollView>

          </View>

        )
    }
}

const style = StyleSheet.create({
    categories:{
        backgroundColor: 'white',
        padding: 10,
    },
    selectedCategory:{
        backgroundColor: 'blue',
        padding: 10,
    },
})

// onRefresh={this.handleRefresh}
// renderItem={({item}) => <Button onPress={() => this.setCategory(item.id)} title={item.name}/>
