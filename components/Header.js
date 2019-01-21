import React from 'react';
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Button,
    TouchableHighlight,Dimensions
} from 'react-native';
import {
    Icon
} from 'react-native-elements';
import {
    SafeAreaView
} from 'react-navigation';

const {width} = Dimensions.get('window')


export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render(){
        return(
            <SafeAreaView
                style={{
                    flexDirection: "row",
                    height: 50,
                    // marginTop: Platform.OS == "ios" ? 39 : 0 // only for IOS to give StatusBar Space
                }}
            >
          <View style={{flex: 1, alignItems:'center', justifyContent:'center'}}>
            <Icon
              name='person'
              size={22}
              color='#696969'
              onPress={() => this.props.navigation.navigate("UserProfile")}
            />
          </View>
          <View
              style={{ flex:2 }}
          >
              <Image
              source={{uri: "https://baomoi.press/wp-content/uploads/2017/08/logo.png"}}
              style={{ height: 35 ,marginLeft:73,marginTop:5, resizeMode:'contain', }}
              />
          </View>
          <View style={{flex: 1, alignItems:'flex-end', justifyContent:'center'}}>
            <Icon
              name='search'
              size={22}
              color='#696969'
              onPress={()=>this.props.navigation.navigate("Search")}
            />
          </View>
          <View style={{flex: 1, alignItems:'flex-end', marginRight: 10, justifyContent:'center'}}>
            <Icon
                onPress={() => this.props.navigation.navigate("Settings")}
                name='settings'
                size={22}
                color='#696969'
            />
          </View>
        </SafeAreaView>
        )
    }
}
