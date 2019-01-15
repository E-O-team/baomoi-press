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
} from 'react-native';
import {Icon} from 'react-native-elements';
import {SafeAreaView} from 'react-navigation';

export default class Header extends React.Component{
  constructor(props){
    super(props);
    this.state={
    }
  }
  render(){
    return(
        <View
          style={{
            flexDirection: "row",
            height: 50,
            marginTop: Platform.OS == "ios" ? 20 : 0 // only for IOS to give StatusBar Space
          }}
        >
          <View style={{flex: 1, alignItems:'center', justifyContent:'center'}}>
            <Icon
              name='menu'
              size={20}
              color='#696969'
            />
          </View>

          <Image
          source={{uri: "https://baomoi.press/wp-content/uploads/2017/08/logo.png"}}
          style={{ width: 30, height: 30,marginLeft:50,marginTop:10, resizeMode:'contain', flex:2}}
          />
          <View style={{flex: 1, alignItems:'flex-end', justifyContent:'center'}}>
            <Icon
              name='search'
              size={20}
              color='#696969'
              onPress={()=>this.props.navigation.navigate("Search")}
            />
          </View>
          <View style={{flex: 1, alignItems:'flex-end', marginRight: 10, justifyContent:'center'}}>
            <Icon
              name='settings'
              size={20}
              color='#696969'
            />
          </View>
        </View>
    )
  }

}
