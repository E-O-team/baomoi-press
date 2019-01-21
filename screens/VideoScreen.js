import React from 'react';
import {Text, View} from 'react-native';

export default class VideoScreen extends React.Component{
  constructor(props){
    super(props)
  }
  static navigationOptions = {
    title: 'Video',
  };
  render(){
    return(
      <View>
        <Text>this is video screen</Text>
      </View>
    )
  }
}
