import React, { Component } from 'react';
import axios from 'axios';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    SafeAreaView,
    Dimensions,
    Linking,
} from 'react-native';
import { ListItem, List, Tile, Card, Divider, Icon, Badge } from 'react-native-elements';
import { BaomoiText } from '../../StyledText';
const defaultImg ='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png';
export default class CustomArticleAd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: ""
        }
        this.getAD()

    }

    shuffle = (array) => {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
        }

        return array;
    }

    getAD = () => {
        this.cancelTokenSource = axios.CancelToken.source()
        axios.get("https://baomoi.press/wp-json/acf/v3/quangcao?filter[meta_key]=type&filter[meta_value]=article", {
            cancelToken: this.cancelTokenSource.token
        })
        .then(res => {
            const data = this.shuffle(res.data)
            this.setState({
                data: data[0]
            })
        })
        .catch(err => {
            if(axios.isCancel(err)){
                return
            }else{
                console.log(err)
            }
        })
    }

    componentWillUnmount() {
        this.cancelTokenSource && this.cancelTokenSource.cancel()
    }

    render() {
        // return null
        if(this.state.data){
            return(
                <View style={{height: 130}}>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => Linking.openURL(this.state.data.acf.customAdURL)}
                        style={{padding: 10, flex: 1}}
                    >
                        <View style={{flex: 1, flexDirection: "row", alignItems:'center'}}>
                            <View style={{flex: 2}}>
                                <View style={{flexDirection: "row", alignItems: "center"}}>
                                    <View style={{borderRadius: 5, borderWidth: 1, width: 40, borderColor: '#C0C0C0', alignItems: "center", justifyContent: "center"}}>
                                        <Text style={{fontSize: 10, color: '#C0C0C0'}}>Tài Trợ</Text>
                                    </View>
                                    <Text style={{color: '#C0C0C0', fontSize: 14}}> {this.state.data.acf.sponsor_name}</Text>
                                </View>
                                <BaomoiText style={{fontSize: 18, fontWeight: '500',color: "black", marginTop: 5}}>{this.state.data.acf.custom_title}</BaomoiText>

                            </View>
                            <Image
                                source={{uri :this.state.data.acf.customAdImageURL || defaultImg}}
                                style={{height: 90, flex: 1, marginLeft: 5, borderRadius: 5}}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            )
        }else {
            return null
        }
    }

}
