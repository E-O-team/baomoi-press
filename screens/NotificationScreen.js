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


export default class NotificationScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            value: null
        };
    }

    setModalVisible = (visible, value) => {
        this.setState({
            modalVisible: visible,
            value: value
        });
    }

    handleSubmit = () => {
        console.log("submited");
    }

    static navigationOptions = ({
        navigation
    }) => {
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
    render() {
        return (
            <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                <Text>màn hình thông báo</Text>
            </View>
        )
    }
}
