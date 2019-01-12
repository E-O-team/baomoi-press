import React from 'react';
import { Text, View, ScrollView, Dimensions, WebView, StyleSheet, TouchableHighlight, Platform, Share, Image, PixelRatio } from 'react-native';
import HTMLView from 'react-native-htmlview';
import CommentList from '../components/CommentList';
import RecommendedList from '../components/RecommendedList';
import {Consumer, Provider} from '../context/context.js'
const { width } = Dimensions.get('window');


const FACEBOOK_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAAYFBMVEUAAAAAQIAAWpwAX5kAX5gAX5gAX5gAXJwAXpgAWZ8AX5gAXaIAX5gAXpkAVaoAX5gAXJsAX5gAX5gAYJkAYJkAXpoAX5gAX5gAX5kAXpcAX5kAX5gAX5gAX5YAXpoAYJijtTrqAAAAIHRSTlMABFis4vv/JL0o4QvSegbnQPx8UHWwj4OUgo7Px061qCrcMv8AAAB0SURBVEjH7dK3DoAwDEVRqum9BwL//5dIscQEEjFiCPhubziTbVkc98dsx/V8UGnbIIQjXRvFQMZJCnScAR3nxQNcIqrqRqWHW8Qd6cY94oGER8STMVioZsQLLnEXw1mMr5OqFdGGS378wxgzZvwO5jiz2wFnjxABOufdfQAAAABJRU5ErkJggg==";
export default class ArticleScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            Article: {},
        }
    }
    componentWillMount() {
        this.setState({
            Article: this.props.navigation.getParam("Article", "ERR"),
        })
    }
    onShare = () => {
  Share.share({
    ...Platform.select({
      ios: {
        message: 'Have a look on : ',
        url: this.state.Article.link,
      },
      android: {
        message: 'Have a look on : \n' + this.state.Article.link
      }
    }),
    title: 'Wow, did you see that?'
  }, {
    ...Platform.select({
      ios: {
        // iOS only:
        excludedActivityTypes: [
          'com.apple.UIKit.activity.PostToTwitter'
        ]
      },
      android: {
        // Android only:
        dialogTitle: 'Share : ' + this.state.Article.link
      }
    })
  });
}
    render(){
        return(
        <Consumer>
        {({textColor, backGround}) => (
          <ScrollView style={{ flex: 1 , backgroundColor: backGround, padding: 10}}>



            <Text style={{fontSize: 26, fontWeight: 'bold', color: textColor}}>{this.state.Article.title.plaintitle}</Text>
            <HTMLView
              value={this.state.Article.content.plaintext.replace(/\r?\n|\r/g, '')}
              stylesheet={this.textStyle(textColor)}
              renderNode={this.renderNode}
              />
              <TouchableHighlight style={{alignItems: 'center', marginBottom:30, marginTop:20}} onPress={() => this.props.navigation.navigate("OriginalUrl", {
                  OriginalUrl: this.state.Article.source_link
              })}>
                <View style={{alignItems: 'center',justifyContent:'center', borderRadius:30, width: 150, height: 40,backgroundColor:'#cc0000'}}>
                 <Text style={{color:'#ffffff',fontWeight:'800',}}>Link gốc</Text>
                </View>
              </TouchableHighlight>
            <TouchableHighlight style={{alignItems: 'center'}} onPress={this.onShare}>
              <View style={{alignItems: 'center',justifyContent:'center', borderRadius:30, width: 150, height: 40,backgroundColor:'#3b5998'}}>
               <Text style={{color:'#ffffff',fontWeight:'800',}}>Share</Text>
              </View>
            </TouchableHighlight>


            <CommentList article={this.state.Article} ui={{textColor, backGround}}/>
            <RecommendedList article={this.state.Article} navigation={this.props.navigation} ui={{textColor, backGround}}/>

          </ScrollView>
        )}
        </Consumer>

        );
    }
    textStyle = (myColor) => {
       return {
         color: myColor,
         p: {
           fontFamily: 'sans-serif-thin',
           fontSize: 18,
           lineHeight: 25,
           color: myColor,
         },
         h3: {
           color: myColor,
           fontSize: 28,
           fontWeight: 'bold'
         },
       }
     }
    renderNode(node, index, siblings, parent, defaultRenderer) {
      if (node.name == 'img') {
      const { src, height } = node.attribs;
      const imageHeight = height || 300;
      const imageWidth = Dimensions.get('window');
      return (
        <Image
          key={index}
          style={{ width: imageWidth.width-20, height: imageHeight }}
          source={{ uri: src }}
          resizeMode='contain'/>
      );
    }
   }
};

const styles = StyleSheet.create({
  a: {
    fontWeight: '300',
    color: '#FF3366', // make links coloured pink
  },
  p: {
    fontSize: 20,
    lineHeight: 28,
  },
  instructions: {
    marginTop: 20,
    marginBottom: 20,
  },
});
