import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions

} from 'react-native';
import HTML from 'react-native-render-html'
import {Consumer} from '../context/context.js';

export default class NotificationsDetail extends Component {
    constructor(props){
      super(props)
      this.state={noti : {}}
    }
    componentWillMount(){
      this.setState({
          noti: this.props.navigation.getParam("data", "ERR"),
      })
    }

    render() {
        return (
          <Consumer>
            {({textColor, fontSizeRatio}) => (
            <ScrollView style={styles.container}>
            <Text style={{textAlign: 'center', fontFamily: 'baomoi-regular', fontSize: 24*fontSizeRatio, color: textColor, fontWeight:'bold'}}>{this.state.noti.title.rendered}</Text>
            <HTML
              alterChildren = { (node) => {
                  if (node.name === 'iframe') {
                      delete node.attribs.width;
                      delete node.attribs.height;
                  }
                  return node.children;
              }}
              html={this.state.noti.content.rendered}
              imagesMaxWidth={Dimensions.get('window').width-20}
              onLinkPress={(event, href)=>{
                Linking.openURL(href)
              }}
              ignoredStyles={['width', 'height', 'max-width']}
              staticContentMaxWidth={Dimensions.get('window').width-20}
              tagsStyles={{blockquote:{marginLeft: 50}}}
              baseFontStyle={{fontSize: 20*fontSizeRatio, fontFamily: 'baomoi-regular', color:textColor, lineHeight:23*fontSizeRatio }}/>
            </ScrollView>
            )}
          </Consumer>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    }
})
