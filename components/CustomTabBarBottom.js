import React from "react";
import {
  TabBarBottom
} from "react-navigation";
import {BottomTabBar} from "react-navigation-tabs";
import { View, Text, Dimensions, Platform, Animated, Easing, Image, Button, TouchableOpacity} from "react-native";
import { LinearGradient } from "expo";
import { Ionicons  } from '@expo/vector-icons';
import {Icon} from 'react-native-elements';
var { width, height } = Dimensions.get('window');
height = Platform.OS == "ios" ? height-20 : height

export default class CustomTabBarBottom extends React.Component {
  constructor(props){
    super(props)
    this.state={
      animating: false,
      left: new Animated.Value(20),
      bottom: new Animated.Value(30),
      bottomCenter: new Animated.Value(30),

    }
  }
  onClickBtn = ()=>{


    this.setState({animating: true,
      left:  new Animated.Value(20),
      bottom: new Animated.Value(30),
      bottomCenter:new Animated.Value(30)})


    setTimeout(() => {
      Animated.timing(this.state.left, {
        toValue: 120,
        duration: 300,
        easing: Easing.linear,
      }).start();

      Animated.timing(this.state.bottom, {
        toValue: 130,
        duration: 300,
        easing: Easing.linear,
      }).start();
      Animated.timing(this.state.bottomCenter, {
        toValue: 230,
        duration: 300,
        easing: Easing.linear,
      }).start();


    }, 100)



  }
  onCloseBtn = () =>{
    this.setState({animating: false})
  }
  render(){
    var blackscreen = (this.state.animating)?
    <View style={styles.overlayscreen}>
    </View> : <View></View>

    var expandedView = (this.state.animating)?
    <View style={{zIndex: 1000, position:'absolute'}}>
        <View style={styles.closeButton}>
          <View style={{borderColor:'#fff', borderWidth:2, width: 80, height:80, borderRadius: 80/2, bottom: 30, justifyContent:'center'}}>
            <Ionicons name={"ios-close"} size={45} color={"#fff"} style={styles.buttonIcon} onPress={()=>this.onCloseBtn()}/>
          </View>
          <Animated.View style={{     right:this.state.left,
                                       bottom:this.state.bottom,
                                       position:'absolute',
                                      alignItems:'center'}}>
            <View style={styles.IconView}>
              <Ionicons name={"ios-paper"} size={20} color={"#fff"} style={styles.buttonIcon} />
            </View>
            <Text style={styles.iconText}>News</Text>
          </Animated.View>

          <Animated.View style={{left:this.state.left,
                                 bottom:this.state.bottom,
                                 position:'absolute',
                                 alignItems:'center'}}>
            <View style={styles.IconView}>
              <Ionicons name={"ios-share"} size={20} color={"#fff"} style={styles.buttonIcon} />
            </View>
            <Text style={styles.iconText}>Share</Text>
          </Animated.View>

          <Animated.View style={{     right:20,
                                     bottom:this.state.bottomCenter,
                                      position:'absolute',
                                      alignItems:'center'}}>
            <View style={styles.IconView}>
                <Icon
              name='credit-card'
              color='#fff'
              size={20}
              style={styles.buttonIcon}
               />
            </View>
            <Text style={styles.iconText}>Coin</Text>
          </Animated.View>

        </View>
    </View> : <View></View>
    return (
      <View
      >
          <View style={styles.actionButton}>
            <View style={{backgroundColor:'#CC0000', width: 80, height:80, borderRadius: 80/2, bottom: 31, justifyContent:'center'}}>
              <TouchableOpacity onPress={()=>this.onClickBtn()}>
                <Image
                source={{uri: "https://baomoi.press/wp-content/uploads/2017/08/logo.png"}}
                style={{ width: 70, height: 70, marginTop: 10, marginLeft: 5, resizeMode:'contain'}}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{backgroundColor: "#fff", }}>
            <BottomTabBar {...this.props } />
          </View>
          {blackscreen}
          {expandedView}
      </View>
    );
  }

};

const styles = {
  actionButton: {
    justifyContent: 'center', alignItems: 'center',
    top:0,
    left: width/2 - 40,
    right: 0,
    width: 80,
    position: 'absolute',
    zIndex: 998
  },
  buttonIcon: {
    textAlign: "center",
  },
  overlayscreen:{
    backgroundColor:'black',
    opacity: 0.5,
    width: width,
    height:height-50,
    bottom: 0,
    justifyContent:'center',
    zIndex:999,
    position:'absolute'
  },
  closeButton:{
    top:0,
    left: width/2 - 40,
    right: 0,
    width: 80,
    position: 'absolute',
    zIndex: 999,
  },
  IconView:{
    backgroundColor:'#CC0000',
     width: 40,
     height:40,
     borderRadius: 40/2,
     justifyContent:'center',

  },
  iconText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  }
}