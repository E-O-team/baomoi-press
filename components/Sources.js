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
import AuthorSubscription from './AuthorSubscription';
import axios from 'axios';

export default class Sources extends React.PureComponent {
    constructor(props){
        super(props)
        this.state = {
            source: {},
            allSources: [],
            user:{}
        }
    }

    componentWillMount(){
        axios.all([
            axios.get("https://baomoi.press/wp-json/wp/v2/source/" + this.props.item),
            axios.get("https://baomoi.press/wp-json/wp/v2/get_source_logo")
        ])
        .then(axios.spread((sourceRes, allSourcesRes) => {
            this.setState({
                source: sourceRes.data,
                allSources: allSourcesRes.data
            }, () => {
                // this.state.allSources.forEach(item =>{
                //     if(this.state.source.link == item.url){
                //         console.log(item);
                //     }
                // })
                console.log(this.state.source.taxonomy);
            })
        }))
        .catch(err => console.log(err))

        AsyncStorage.getItem('user')
        .then(res => {
            if(res){
                const user = JSON.parse(res)
                this.setState({
                    user: user
                })
            }
        })
    }
    render(){
        const {source} = this.state
        return(
            <Consumer>
                {({textColor, backGround}) => (
                    <View style={{ backgroundColor: backGround, paddingHorizontal: 5}}>
                        {source !== {} &&
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate("Source", {
                                    source: this.state.source
                                })}
                            >
                                <View style={{justifyContent: "space-between"}}>
                                    <View></View>
                                    <View style={{marginTop: 10, marginBottom: 10}}>
                                        <Text style={{color: textColor, fontWeight: "bold"}}>{this.state.source.name}</Text>
                                    </View>
                                    <Divider style={{ backgroundColor: '#e0e0e0', height: 1}} />
                                </View>
                            </TouchableOpacity>
                        }
                    </View>
                )}
            </Consumer>
        )
    }
};
