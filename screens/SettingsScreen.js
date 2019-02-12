import React from 'react';
import {
    Text,
    StyleSheet,
    View,
    TouchableHighlight,
    AsyncStorage,
    Switch
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
      nightMode: true,
    }
  }

  static navigationOptions = ({navigation}) => {
      return {
          title: "Cài Đặt",
          headerStyle: {
              backgroundColor: '#696969',
              },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          }
  }
  logOut = async () => {
      AsyncStorage.clear()
      this.props.navigation.navigate("AuthLoadingScreen")
  }
  handleSwitch = () => {
      this.setState({
          nightMode: !this.state.nightMode,
      })
  }

  render() {


    return(
        <Consumer>
            {({changeDay, changeNight, backGround, changeRatio, fontSizeRatio, nightMode, switchMode, textColor}) => (
                <View style={{backgroundColor: backGround, flex: 1}}>
                    <View style={{
                        justifyContent: "space-between",
                        padding: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        height: 55,
                        backgroundColor: backGround
                    }}>
                        <Text style={{fontSize: 20, color: textColor}}>Chế độ ban đêm</Text>
                        <Switch
                            onValueChange={switchMode}
                            value={nightMode}
                        />
                    </View>

                    <View style={{ alignItems: 'stretch', justifyContent: 'center', padding: 10 }}>
                        <Text style={{fontSize: 20, color: textColor}}>Cỡ chữ</Text>
                        <Slider
                            value={fontSizeRatio}
                            onValueChange={value => {
                                changeRatio(value)
                            }}
                            step={0.2}
                            minimumValue={0.8}
                            maximumValue={1.2}
                            minimumTrackTintColor='#696969'
                        />
                        {
                          fontSizeRatio == 1 ?
                          <Text style={{fontSize: 18, color: textColor}}>Medium</Text> :
                          fontSizeRatio == 0.8 ?
                          <Text style={{fontSize: 18, color: textColor}}>Small</Text> :
                          <Text style={{fontSize: 18, color: textColor}}>Large</Text>
                        }

                    </View>
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
    },
    slider: {
      backgroundColor: 'blue',

    }

})
