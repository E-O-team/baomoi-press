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
            data: Object.values(this.props.navigation.getParam("subscribed"))
        }
    }

    static navigationOptions = ({navigation}) => {
        return {
            tabBarVisible: false,
            header: (
              <Consumer>
                {({backGround, textColor}) => (
                    <SafeAreaView
                        style={{
                            height: 60,
                            marginTop: 20,
                            flexDirection: "row",
                            backgroundColor: backGround,
                            alignItems:'center',
                            borderBottomWidth: 1,
                            borderBottomColor: '#C6C3BC'
                        }}
                    >
                        <View>
                            <Icon
                                name='chevron-left'
                                size={35}
                                color={textColor}
                                onPress={() => {
                                    navigation.goBack()
                                    navigation.openDrawer()
                                }}
                            />
                        </View>
                    </SafeAreaView>
                )}
            </Consumer>
            )
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
