import React from 'react';
import { Text, StyleSheet, View, TouchableHighlight} from 'react-native';
import {Provider, Consumer} from '../context/context.js'


export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Setting',
  };

  render() {
    return(
      <View>
                    <Text style={styles.header}>Setting </Text>
    <Consumer>
        {({changeDay, changeNight}) => (
      <View>
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
      </View>
        )}
    </Consumer>

  </View>
    )
  }
}
const styles = StyleSheet.create({
  header: {
    fontSize:30,
    textAlign:'center',
  }
})
