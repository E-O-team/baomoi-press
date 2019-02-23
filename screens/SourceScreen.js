import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    SafeAreaView,
    ActivityIndicator,
    AsyncStorage,
    FlatList,
} from 'react-native';
import {Consumer} from '../context/context.js'
import { Avatar, Card, Icon, Button, Divider, Badge } from 'react-native-elements';
import axios from 'axios';
import Articles from '../components/Articles';

export default class SourceScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            source: this.props.navigation.getParam("source"),
            articles: []
        }
    }

    componentWillMount() {
        axios.get("https://baomoi.press//wp-json/wp/v2/posts?filter[taxonomy]=source&filter[term]=" + this.state.source.slug)
        .then(res => this.setState({
            articles: res.data
        }))
        .catch(err => console.log(err))
    }

    render(){
        const {source} = this.state
        return(
            <Consumer>
                {({textColor, backGround}) => (
                    <View style={{backgroundColor: backGround, padding: 5}}>
                        <Text style={{color: textColor, fontSize: 40, fontWeight: "bold"}}>{source.name}</Text>
                        <Divider style={{ backgroundColor: '#e0e0e0', height: 1}} />
                        <FlatList
                            initialNumToRender={5}
                            data={this.state.articles}
                            extraData={this.state.articles}
                            renderItem={({ item, index }) => <Articles item={item} navigation={this.props.navigation} ui={{textColor, backGround}} index={index}/>}
                            keyExtractor={item => item.id.toString()}
                        />
                    </View>
                )}
            </Consumer>
        )
    }
};
