import React from 'react';
import { Text, View, AsyncStorage,Keyboard,ScrollView,TextInput, Dimensions, WebView, StyleSheet, TouchableOpacity, TouchableHighlight, Platform, Share, Image, PixelRatio, Modal } from 'react-native';
import HTMLView from 'react-native-htmlview';
import CommentList from '../components/CommentList';
import RecommendedList from '../components/RecommendedList';
import AuthorSubscription from '../components/AuthorSubscription';
import CommentModal from '../components/CommentModal';
import {Consumer, Provider} from '../context/context.js';
import {Icon} from 'react-native-elements';
import {SafeAreaView} from 'react-navigation';
import moment from 'moment/min/moment-with-locales'
import axios from 'axios';
import { BaomoiText } from '../components/StyledText';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
moment.locale('vi');

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
            tabBarVisible: false,
            header: (
              <Consumer>
                {({backGround}) => (
                  <SafeAreaView
                      style={{
                          flexDirection: "row",
                          height: 50,
                          backgroundColor: backGround,
                          marginTop: 20,
                          alignItems:'center'
                          // marginTop: Platform.OS == "ios" ? 39 : 0 // only for IOS to give StatusBar Space
                      }}
                      >
                      <View style={{flex: 1, alignItems:'left'}}>
                        <Icon
                          name='chevron-left'
                          size={35}
                          color='#696969'
                          onPress={()=>navigation.goBack()}
                        />
                      </View>
                      <View style-={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
                        <Icon
                          name='dots-three-vertical'
                          type='entypo'
                          size={25}
                          color='#696969'
                          onPress={()=>navigation.navigate('Settings')}
                        />
                  </View>
              </SafeAreaView>
                )}
            </Consumer>
            )
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
        {({textColor, backGround, fontSizeRatio}) => (
        <View style={{backgroundColor: backGround, flexDirection:'column', flex: 1}}>
          <ScrollView style={{ height: this.state.height - 40 , backgroundColor: backGround, padding: 10, zIndex: 1}}>



            <BaomoiText style={{fontSize: 28*fontSizeRatio, fontWeight: 'bold', color: textColor}}>{this.state.Article.title.plaintitle}</BaomoiText>
            <BaomoiText style={{color: '#696969', marginTop:10, fontSize: 15*fontSizeRatio}}>Last Updated {moment(this.state.Article.modified).fromNow()}</BaomoiText>

            <AuthorSubscription taxonomy_source={this.state.Article.taxonomy_source[0]} user={this.state.user}/>

            <HTMLView
              value={this.state.Article.content.plaintext.replace(/\r?\n|\r/g, '')}
              stylesheet={this.textStyle(textColor, fontSizeRatio)}
              renderNode={this.renderNode}
              />
            <View style={{flexDirection: 'row', marginTop : 20}}>

                  <View style={{alignItems: 'center', flex: 1}}>
                    <TouchableHighlight style={{alignItems: 'center',justifyContent:'center', borderRadius:5, width: 100, height: 40,backgroundColor:'#cc0000'}} onPress={() => this.props.navigation.navigate("OriginalUrl", {
                        OriginalUrl: this.state.Article.source_link
                    })}>
                     <BaomoiText style={{color:'#ffffff',fontWeight:'800',fontSize: 18}}>Link gốc</BaomoiText>
                    </TouchableHighlight>
                  </View>

                <View style={{alignItems: 'center', flex: 1}}>
                  <TouchableHighlight style={{alignItems: 'center',justifyContent:'center', borderRadius:5, width: 100, height: 40,backgroundColor:'#3b5998'}} onPress={this.onShare}>
                   <BaomoiText style={{color:'#ffffff',fontWeight:'800', fontSize: 18}}>Share</BaomoiText>
                  </TouchableHighlight>
                </View>
            </View>


            <CommentList article={this.state.Article} navigation={this.props.navigation} ui={{textColor, backGround, fontSizeRatio}} user={this.state.user}/>
            <RecommendedList article={this.state.Article} navigation={this.props.navigation} ui={{textColor, backGround, fontSizeRatio}} currentCount={this.state.currentCount}/>

          </ScrollView>

          <CommentModal article={this.state.Article} user={this.state.user} navigation={this.props.navigation}/>



        </View>
        )}
      </Consumer>

        );
    }
    textStyle = (myColor, r) => {
       return {
         color: myColor,
         p: {
           fontSize: 18*r,
           lineHeight: 25,
           color: myColor,
           fontFamily: 'baomoi-regular'
         },
         h3: {
           color: myColor,
           fontSize: 25*r,
           fontWeight: 'bold',
           fontFamily: 'baomoi-regular'
         },
       }
     }
    renderNode(node, index, siblings, parent, defaultRenderer) {
      if (node.name === 'img') {
      const { src, height } = node.attribs;
      const imageHeight = height ? Number.parseInt(height, 10) : 300;
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

});
