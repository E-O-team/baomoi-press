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

import { ListItem, List, Tile, Card, Divider, Icon } from 'react-native-elements'
import {
    WebBrowser
} from 'expo';
import { MonoText } from './StyledText';

export default class Categories extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            selectedCategories: "Home",
            categories:
        }
    }
    fetchCategories = () => {
        fetch("https://baomoi.press/wp-json/wp/v2/categories")
        .then(res => res.json())
        .then(json => this.setState({
            categories: json
        }))
        .catch(err => console.log(err))
    }
    componentWillMount() {
        this.fetchCategories()
    }
    render(){
        return(
            <View style={{flex: 1}}>
                <ScrollView horizontal={true}>
                    <FlatList
                        data={this.state.categories}
                        renderItem={({item}) => <Text>{item.name}</Text>}
                        keyExtractor={item => item.slug}
                    />
                    <FlatList
                        data={this.state.categories}
                        renderItem={({item}) => <Text>{item.name}</Text>}
                        keyExtractor={item => item.slug}
                    />
                    <FlatList
                        data={this.state.categories}
                        renderItem={({item}) => <Text>{item.name}</Text>}
                        keyExtractor={item => item.slug}
                    />
                </ScrollView>
            </View>
        )
    }
}
