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
import Sources from '../components/Sources';
import axios from 'axios';

export default class FollowingScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            data: this.props.navigation.getParam("subscribed")
        }
    }
    render(){
        return(
            <Consumer>
                {({textColor, backGround}) => (
                    <View style={{flex: 1, backgroundColor: backGround}}>
                        <FlatList
                            data={this.state.data}
                            extraData={this.state.data}
                            renderItem={({ item, index }) => <Sources item={item} navigation={this.props.navigation} ui={{textColor, backGround}} index={index}/>}
                            keyExtractor={item => item}
                        />
                    </View>
                )}
            </Consumer>
        )
    }
};

const style = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
    }
})

// <View style={styles.container}>
//     <FlatList
//         data={this.state.data}
//         renderItem={({ item }) => <Sources item={item} navigation={this.props.navigation} ui={{textColor, backGround}} index={index}/>}
//     />
// </View>
