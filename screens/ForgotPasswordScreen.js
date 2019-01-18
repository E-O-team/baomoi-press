import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Button,
} from 'react-native';
import { ListItem, List, Tile, Card, Divider, Icon } from 'react-native-elements'
export default class ForgotPasswordScreen extends React.Component {
    render(){
        return(
            <View style={styles.container}>
                <Text>Forgot Password Screen</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
})
