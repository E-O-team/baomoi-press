import React from 'react';
import { Text, View, AsyncStorage, ScrollView, Dimensions, WebView, StyleSheet, TouchableHighlight, Platform, Share, Image, PixelRatio } from 'react-native';
import HTMLView from 'react-native-htmlview';
import CommentList from '../components/CommentList';
import RecommendedList from '../components/RecommendedList';
import AuthorSubscription from '../components/AuthorSubscription'
import {Consumer, Provider} from '../context/context.js';
import Moment from 'moment';
import axios from 'axios';
const screenWidth = Dimensions.get('window').width;

export default class ArticleScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            Article: {},
            currentCount : 0,
            intervalId: undefined,
            user: undefined,
        }
    }
    static navigationOptions = ({navigation}) => {
        return {
            title: "Article",
            tabBarVisible: false
        }
    }
    componentWillMount = async () => {

        this.setState({
            Article: this.props.navigation.getParam("Article", "ERR"),
        })

        this.setState({
            user: JSON.parse(await AsyncStorage.getItem('user'))
        })
        if(this.props.navigation.getParam("currentCount", "ERR") === "ERR")
        {
        const value = await AsyncStorage.getItem('seconds')
        if(value !== null) this.setState({currentCount: Number.parseInt(value)})
        var intervalId = setInterval(this.timer, 1000)
   // store intervalId in the state so it can be accessed later:
        this.setState({intervalId: intervalId})
        }
    }
    timer = async () =>  {
      // setState method is used to update the state
       this.setState({ currentCount: this.state.currentCount + 1 })
       console.log(this.state.currentCount)
       if(this.state.currentCount >= 180)
       {
         this.setState({ currentCount: 0 })
         if(this.state.user !== null){
             axios({
                 method: "GET",
                 url: 'https://baomoi.press/wp-json/wp/v2/add_exp?ammount=1',
                 headers: {'Authorization': 'Bearer ' + this.state.user.token},
             })
         }

       }

    }


    componentWillUnmount() {
      // use intervalId from the state to clear the interval
       clearInterval(this.state.intervalId)
       AsyncStorage.setItem('seconds', this.state.currentCount.toString())
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
            <Text style={{color: '#696969', marginTop:10}}>Last Updated {Moment(this.state.Article.modified).utc().format('YYYY-MM-DD HH:mm:ss')}</Text>

            <AuthorSubscription taxonomy_source={this.state.Article.taxonomy_source[0]} user={this.state.user}/>

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


            <CommentList article={this.state.Article} navigation={this.props.navigation} ui={{textColor, backGround}} user={this.state.user}/>
            <RecommendedList article={this.state.Article} navigation={this.props.navigation} ui={{textColor, backGround}} currentCount={this.state.currentCount}/>

          </ScrollView>
        )}
        </Consumer>

        );
    }
    textStyle = (myColor) => {
       return {
         color: myColor,
         p: {
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
      if (node.name === 'img') {
      const { src, height } = node.attribs;
      const imageHeight = 300;
      const imageWidth = screenWidth - 20;
      return (
        <Image
          key={index}
          style={{ width: imageWidth, height: imageHeight }}
          source={{ uri: src }}
          resizeMode='contain'/>
      );
    }
    if(node.name == 'p' && node.children.length != 0) {
      const iframeNodes = node.children.filter((node) => node.name === 'iframe')
      const sources = iframeNodes.map((node) => node.attribs.src);
      if (iframeNodes.length != 0)
        return (
          <View>
            <WebView source={{uri : sources[0]}} style={{width:screenWidth-20, height: 300}}/>
          </View>
        )
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
