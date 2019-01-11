import React from 'react';
import { Text, View, ScrollView, Dimensions, WebView, StyleSheet, TouchableHighlight, Platform, Share } from 'react-native';
import HTMLView from 'react-native-htmlview';
import CommentList from '../components/CommentList';
import RecommendedList from '../components/RecommendedList';
import {Consumer, Provider} from '../context/context.js'


const FACEBOOK_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAAYFBMVEUAAAAAQIAAWpwAX5kAX5gAX5gAX5gAXJwAXpgAWZ8AX5gAXaIAX5gAXpkAVaoAX5gAXJsAX5gAX5gAYJkAYJkAXpoAX5gAX5gAX5kAXpcAX5kAX5gAX5gAX5YAXpoAYJijtTrqAAAAIHRSTlMABFis4vv/JL0o4QvSegbnQPx8UHWwj4OUgo7Px061qCrcMv8AAAB0SURBVEjH7dK3DoAwDEVRqum9BwL//5dIscQEEjFiCPhubziTbVkc98dsx/V8UGnbIIQjXRvFQMZJCnScAR3nxQNcIqrqRqWHW8Qd6cY94oGER8STMVioZsQLLnEXw1mMr5OqFdGGS378wxgzZvwO5jiz2wFnjxABOufdfQAAAABJRU5ErkJggg==";
export default class ArticleScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            Article: {},
            title: '',
        }
    }
    componentWillMount() {
        this.setState({
            Article: this.props.navigation.getParam("Article", "ERR"),
            title: "<h2>"+this.props.navigation.getParam("Article", "ERR").title.rendered+"</h2>",
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
          <ScrollView style={{ flex: 1 , backgroundColor: 'white', padding: 10}}>
            <Consumer>
              {({textColor}) => console.log(textColor)}
            </Consumer>
            <HTMLView
              value={this.state.title}
              stylesheet={styles}
              />
            <HTMLView
              value={this.state.Article.content.plaintext}
              stylesheet={styles}
              />
              <TouchableHighlight style={{alignItems: 'center', marginBottom:20}} onPress={() => this.props.navigation.navigate("OriginalUrl", {
                  OriginalUrl: this.state.Article.source_link
              })}>
                <View style={{alignItems: 'center',justifyContent:'center', width: 150, height: 30,backgroundColor:'red'}}>
                 <Text style={{color:'#ffffff',fontWeight:'800',}}>Link gốc</Text>
                </View>
              </TouchableHighlight>
            <TouchableHighlight style={{alignItems: 'center'}} onPress={this.onShare}>
              <View style={{alignItems: 'center',justifyContent:'center', width: 150, height: 50,backgroundColor:'#3b5998'}}>
               <Text style={{color:'#ffffff',fontWeight:'800',}}>Share</Text>
              </View>
            </TouchableHighlight>


            <CommentList article={this.state.Article}/>
            <RecommendedList article={this.state.Article} navigation={this.props.navigation}/>

          </ScrollView>

        );
    }
};

const styles = StyleSheet.create({
  br:{
    lineHeight: 5,
  },
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
