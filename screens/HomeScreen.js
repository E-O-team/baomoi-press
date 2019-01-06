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

import { ListItem, List, Tile, Card } from 'react-native-elements'
import {
    WebBrowser
} from 'expo';

import { MonoText } from '../components/StyledText';
const defaultImg ='https://wallpaper.wiki/wp-content/uploads/2017/04/wallpaper.wiki-Images-HD-Diamond-Pattern-PIC-WPB009691.jpg';
export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: true,
            articles: [],
        }
    }
    static navigationOptions = {
        title: "Home",
    };
    componentWillMount() {
        this.fetchNews()
    }
    fetchNews = () => {
        fetch("https://baomoi.press/wp-json/wp/v2/posts")
        .then(res => res.json())
        .then(json => this.setState({
            articles: json,
            refreshing: false,
        }))
        // .then(json => console.log(json))
        .catch(err => console.log(err))
    }
    handleRefresh = () => {
        this.setState({
                refreshing: true
            },
            () => this.fetchNews()
        );
    }
    render() {
        return(
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
                
                            containerStyle={{backgroundColor: "white"}}
                        >
                            <Text>{item.excerpt.rendered}</Text>
                        </Tile>
                    }
                    keyExtractor={item => item.slug}
                    refreshing={this.state.refreshing}
                    onRefresh={this.handleRefresh}
                />
            </View>

        )
    }
}
