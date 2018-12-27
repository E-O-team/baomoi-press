import React from 'react';
import Articles from './Articles';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
} from 'react-native';

import { ListItem, List } from 'react-native-elements'
import {
    WebBrowser
} from 'expo';

import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: true,
            articles: [],
        }
    }
    static navigationOptions = {
        header: null,
    };
    componentWillMount() {
        this.fetchNews()
    }
    fetchNews = () => {
        var url = 'https://newsapi.org/v2/top-headlines?' +
          'country=us&' +
          'apiKey=68a4777092bb462aa192eb8c45b0c95a';
        fetch(url)
        .then(response => response.json())
        .then(json => {
            this.setState({
                articles: json.articles,
                refreshing: false,
            })
        })
        .catch(err => console.log(err))
    }
    handleRefresh = () => {
        this.setState({
                refreshing: true
            },
            () => this.fetchNews()
        );
    }
    renderNews ({ item }) {
        return (
            <View>
                <Image
                     style={{width: 180, height: 180}}
                     source={{uri: item.urlToImage}}
               />
                <ListItem
                    title={item.title}
                    subtitle={item.description}
                />
            </View>
        )
    }

    render() {
        return (
            <List>
                <FlatList
                    data={this.state.articles}
                    renderItem={({ item }) => <Articles article={item} />}
                    keyExtractor={item => item.title}
                />
            </List>
        );
    }
}
