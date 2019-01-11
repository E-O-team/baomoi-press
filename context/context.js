import React from 'react';
import { Text, StyleSheet, View, TouchableHighlight} from 'react-native';

const { Provider, Consumer } = React.createContext({
  textColor: 'black',
  background: 'white'
  ChangeDay: () => {
    this.setState({
      textColor: 'black',
      background: 'white'
    })
  }
  ChangeNight: () => {
    this.setState({
      textColor: 'white',
      background: 'black'
    })
  }
});
