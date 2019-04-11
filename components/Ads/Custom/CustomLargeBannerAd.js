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
export default class CustomLargeBannerAd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: "",
        }
        this.getAD()
    }

    getAD = () => {
        axios.get("https://baomoi.press/wp-json/acf/v3/quangcao?filter[meta_key]=source&filter[meta_value]=custom")
        .then(res => {
            let data = res.data.filter(obj => (obj.acf.AdPosition == this.props.AdPosition && obj.acf.type == "largeBanner"))
            this.setState({
                data: data[0]
            })
        })
        .catch(err => console.log(err))
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
        height: 110,
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        width: 320,
        height: 100,
    }
})
