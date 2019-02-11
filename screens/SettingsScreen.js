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
      value : 2,
      nightMode: true,
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
  handleSwitch = () => {
      this.setState({
          nightMode: !this.state.nightMode,
      })
  }

  render() {
    return(
        <Consumer>
            {({changeDay, changeNight, backGround, changeRatio, nightMode, switchMode}) => (
                <View style={{backgroundColor: backGround, flex: 1}}>
                    <Text style={styles.header}>Setting </Text>

                    <View style={{
                        justifyContent: "space-between",
                        padding: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        height: 55,
                        backgroundColor: backGround
                    }}>
                        <Text style={{fontSize: 20}}>Chế độ ban đêm</Text>
                        <Switch
                            onValueChange={switchMode}
                            value={nightMode}
                        />
                    </View>

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

})
