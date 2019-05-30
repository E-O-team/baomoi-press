import React from 'react';
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Button,
    TouchableHighlight,
    Dimensions,
    SafeAreaView,
    StatusBar
} from 'react-native';
import {
    Icon
} from 'react-native-elements';
import {Consumer} from '../context/context.js';

const {width} = Dimensions.get('window')


export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render(){
        return(
            <Consumer>
                {({textColor, backGround}) => (
                    <SafeAreaView
                        style={{
                            flexDirection: "row",
                            height: 50,
                            backgroundColor: backGround,
                            borderBottomWidth: (this.props.shouldHaveDivider) ? 0.5 : 0,
                            borderBottomColor: '#e0e0e0'
                        }}
                    >
                        <TouchableOpacity style={{flex: 1, alignItems:'center', justifyContent:'center'}} onPress={() => this.props.navigation.openDrawer()}>
                            <Icon
                            name='user'
                            type='feather'
                            size={22}
                            color='#696969'
                            />
                        </TouchableOpacity>
                        <View
                            style={{ flex:3, alignItems: 'center', justifyContent: "center" }}
                        >
                            <Image
                            source={{uri: "https://baomoi.press/wp-content/uploads/2017/08/logo.png"}}
                            style={{ height: 70 , width: 70, resizeMode:'contain' }}
                            />
                        </View>
                        <TouchableOpacity style={{flex: 1, alignItems:'center', justifyContent:'center'}} onPress={()=>this.props.navigation.navigate("Search")}>
                            <Icon
                            name='search'
                            size={22}
                            color='#696969'
                            />
                        </TouchableOpacity>
                    </SafeAreaView>
                )}
            </Consumer>
        )
    }
}
