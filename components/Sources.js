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
const defaultImg ='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png';

export default class Sources extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            source: {},
            allSources: [],
            user:{},
            img: defaultImg,
        }
    }

    componentDidMount(){
        this.cancelTokenSource = axios.CancelToken.source()
        axios.all([
            axios.get("https://baomoi.press/wp-json/wp/v2/source/" + this.props.item, {
                cancelToken: this.cancelTokenSource.token
            }),
            axios.get("https://baomoi.press/wp-json/wp/v2/get_source_logo", {
                cancelToken: this.cancelTokenSource.token
            })
        ])
        .then(axios.spread((sourceRes, allSourcesRes) => {
            this.setState({
                source: sourceRes.data,
                allSources: allSourcesRes.data
            }, () => {
                this.state.allSources.forEach(item =>{
                    if(this.state.source.link == item.url){
                        let tempSource = this.state.source
                        tempSource.img = item.img
                        this.setState({
                            source: tempSource,
                            img: tempSource.img
                        })
                    }
                })

            })
        }))
        .catch(err => {
            if(axios.isCancel(err)){
                return
            }else{
                console.log(err)
            }
        })

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

    componentWillUnmount() {
        this.cancelTokenSource && this.cancelTokenSource.cancel()
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
                                    <View style={{marginTop: 10, marginBottom: 10, flexDirection: "row", alignItems: "center"}}>
                                        <Avatar
                                            medium
                                            rounded
                                            source={{uri: this.state.img || defaultImg}}
                                        />
                                        <Text style={{color: textColor, fontWeight: "bold", fontSize: 17, marginLeft: 10}}>{this.state.source.name}</Text>
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
