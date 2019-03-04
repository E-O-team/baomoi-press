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
    Modal,
    TouchableHighlight,
    Alert
} from 'react-native';
import {
    Consumer
} from '../context/context.js'
import {
    Avatar,
    Card,
    Icon,
    Button,
    Divider,
    Badge
} from 'react-native-elements';
import Sources from '../components/Sources';
import axios from 'axios';

export default class ExchangeHistory extends React.Component {
    render(){
        return(
            <View style={styles.container}>
                <Text>ExchangeHistory</Text>
            </View>
        )
    }
};

styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white"
    }
})
