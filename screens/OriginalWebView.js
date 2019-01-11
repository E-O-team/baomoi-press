import React from 'react';
import { Text, View, WebView} from 'react-native';

export default class OriginalWebView extends React.Component{
  constructor(props) {
      super(props)
      this.state = {
        uri : ''
      }
  }
  componentWillMount(){
    this.setState({uri : this.props.navigation.getParam("OriginalUrl", "ERR")})
  }
  render(){
    return (
      <WebView
        source={{uri: this.state.uri}}
        style={{marginTop: 20}}
      />
    )
  }
}
