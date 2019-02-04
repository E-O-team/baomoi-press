import React from 'react';
import {
    Text,
    StyleSheet,
    View,
    TouchableHighlight,
    AsyncStorage,
} from 'react-native';
import { Slider } from 'react-native-elements';
import {
    Provider,
    Consumer
} from '../context/context.js'


export default class SettingsScreen extends React.Component {
  constructor(){
    super()
    this.state={
      value : 2,
    }
  }

  static navigationOptions = ({navigation}) => {
      return {
          title: "Setting",
      }
  }
  logOut = async () => {
      AsyncStorage.clear()
      this.props.navigation.navigate("AuthLoadingScreen")
  }

  render() {
    return(
        <Consumer>
            {({changeDay, changeNight, backGround, changeRatio}) => (
                <View style={{backgroundColor: backGround, flex: 1}}>
                    <Text style={styles.header}>Setting </Text>

                    <TouchableHighlight style={{alignItems: 'center', marginTop : 30}} onPress={changeDay}>
                        <View style={{alignItems: 'center',justifyContent:'center', borderRadius:30, width: 100, height: 50,backgroundColor:'#ff9933'}}>
                            <Text style={{color:'#ffffff',fontWeight:'800',}}>Day mode</Text>
                        </View>
                    </TouchableHighlight>

                    <TouchableHighlight style={{alignItems: 'center', marginTop : 30}} onPress={changeNight}>
                        <View style={{alignItems: 'center',justifyContent:'center', borderRadius:30, width: 100, height: 50,backgroundColor:'#4c0099'}}>
                            <Text style={{color:'#ffffff',fontWeight:'800',}}>Night mode</Text>
                        </View>
                    </TouchableHighlight>

                    <View style={{ flex: 1, alignItems: 'stretch', justifyContent: 'center', padding: 10 }}>
                        <Text style={{fontSize: 20, color: '#696969'}}>Cỡ chữ</Text>
                        <Slider
                            value={this.state.value}
                            onValueChange={value => {
                                this.setState({value: value})
                                changeRatio(value)
                            }}
                            step={1}
                            minimumValue={1}
                            maximumValue={3}
                        />

                    </View>
                    <TouchableHighlight style={{alignItems: 'center'}} onPress={this.logOut}>
                        <View style={{alignItems: 'center',justifyContent:'center', borderRadius:30, width: 100, height: 50,backgroundColor:'#006666'}}>
                            <Text style={{color:'#ffffff',fontWeight:'800',}}>Log Out</Text>
                        </View>
                    </TouchableHighlight>
                </View>
          )}
        </Consumer>
        )
    }
}

const styles = StyleSheet.create({
  header: {
    fontSize:30,
    textAlign:'center',
    color: '#696969'
  }
})
