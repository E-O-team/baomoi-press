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
const screenWidth = Dimensions.get('window').width;
export default class CustomBannerAd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: "",
        }
        this.getAD()
    }

    getAD = () => {
        this.cancelTokenSource = axios.CancelToken.source()
        axios.get("https://baomoi.press/wp-json/acf/v3/quangcao?filter[meta_key]=source&filter[meta_value]=custom", {
            cancelToken: this.cancelTokenSource.token
        })
        .then(res => {
            let data = res.data.filter(obj => (obj.acf.AdPosition == this.props.AdPosition && obj.acf.type == "banner"))
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
        if(!this.state.data){
            return null
        }else{
            return(
                <View style={styles.container}>
                    <TouchableOpacity
                        onPress={() => Linking.openURL(this.state.data.acf.customAdURL)}
                    >
                        <Image
                            source={{uri: this.state.data.acf.customAdImageURL}}
                            style={styles.image}
                        />
                    </TouchableOpacity>
                </View>
            )
        }
    }

}

const styles = StyleSheet.create({
    container:{
        height: 70,
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        width: screenWidth - 15,
        height: 50,
    }
})
