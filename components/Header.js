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
    SafeAreaView
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
                            marginTop: 20
                            // marginTop: Platform.OS == "ios" ? 39 : 0 // only for IOS to give StatusBar Space
                        }}
                    >
                    <View style={{flex: 1, alignItems:'center', justifyContent:'center'}}>
                        <Icon
                        name='user'
                        type='feather'
                        size={22}
                        color='#696969'
                        onPress={() => this.props.navigation.openDrawer()}
                        />
                    </View>
                    <View
                        style={{ flex:3, alignItems: 'center', justifyContent: "center" }}
                    >
                        <Image
                        source={{uri: "https://baomoi.press/wp-content/uploads/2017/08/logo.png"}}
                        style={{ height: 70 , width: 70, resizeMode:'contain' }}
                        />
                    </View>
                    <View style={{flex: 1, alignItems:'center', justifyContent:'center'}}>
                        <Icon
                        name='search'
                        size={22}
                        color='#696969'
                        onPress={()=>this.props.navigation.navigate("Search")}
                        />
                    </View>
                </SafeAreaView>
                )}
            </Consumer>
        )
    }
}
