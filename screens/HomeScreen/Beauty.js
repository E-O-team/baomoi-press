import React from 'react';
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
    Button,
    TouchableHighlight,
    Dimensions,
    AsyncStorage,
    ActivityIndicator,
} from 'react-native';
import Header from '../../components/Header';
export default class BeautyScreen extends React.Component {
    render(){
        return(
            <View style={styles.container}>
                <Text>This is Beauty Screen</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
    }
})
