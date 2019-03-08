import React from 'react';
import { Text, View, Linking, AsyncStorage,Keyboard,ScrollView,TextInput, Dimensions, WebView, StyleSheet, TouchableOpacity, TouchableHighlight, Platform, Share, Image, PixelRatio, Modal } from 'react-native';
import HTMLView from 'react-native-htmlview';
import HTML from 'react-native-render-html';
import CommentList from '../components/CommentList';
import RecommendedList from '../components/RecommendedList';
import AuthorSubscription from '../components/AuthorSubscription';
import CommentModal from '../components/CommentModal';
import HyperText from '../components/HyperText'
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
            comments: []
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
                          height: 55,
                          backgroundColor: backGround,
                          marginTop: 20,
                          alignItems:'center',
                          borderBottomWidth: 1,
                          borderBottomColor: '#C6C3BC'
                          // marginTop: Platform.OS == "ios" ? 39 : 0 // only for IOS to give StatusBar Space
                      }}
                      >
                      <View style={{flex: 1, alignItems:'flex-start'}}>
                        <Icon
                          name='chevron-left'
                          size={35}
                          color='#696969'
                          onPress={()=>navigation.goBack()}
                        />
                      </View>
                      <View style={{flex:1, alignItems: 'flex-end', justifyContent: 'center'}}>
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
        },() => {this.fetchComment()})


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

    fetchComment = () => {
      fetch("https://baomoi.press/wp-json/wp/v2/comments?post="+this.state.Article.id)
      .then(res => res.json())
      .then(json => this.setState({
          comments: json,
      }))
      // .then(json => console.log(json))
      .catch(err => console.log(err))
    }

    render(){
        return(
      <Consumer>
        {({textColor, backGround, fontSizeRatio}) => (
        <View style={{backgroundColor: backGround, flexDirection:'column', flex: 1}}>
          <ScrollView ref={(scrollView) => { this.scrollView = scrollView }} style={{ height: this.state.height - 40 , backgroundColor: backGround, padding: 10, zIndex: 1}}>



            <Text style={{fontSize: 24*fontSizeRatio, fontWeight: 'bold',fontFamily: 'baomoi-regular', color: textColor}}>{this.state.Article.title.plaintitle}</Text>
            <BaomoiText style={{color: '#696969', marginTop:10, fontSize: 15*fontSizeRatio}}>Cập nhật {moment(this.state.Article.modified).fromNow()}</BaomoiText>

            <AuthorSubscription taxonomy_source={this.state.Article.taxonomy_source[0]} user={this.state.user}/>

            {
              (this.state.Article.format === 'video')?
              <HyperText>
              {this.state.Article.content.plaintext}
              </HyperText> :
              <HTML
                alterChildren = { (node) => {
                    if (node.name === 'iframe') {
                        delete node.attribs.width;
                        delete node.attribs.height;
                    }
                    return node.children;
                }}
                html={this.state.Article.content.plaintext}
                imagesInitialDimensions={{width: 200, height: 200}}
                imagesMaxWidth={Dimensions.get('window').width-20}
                onLinkPress={(event, href)=>{
                  Linking.openURL(href)
                }}
                ignoredStyles={['width', 'height', 'max-width']}
                staticContentMaxWidth={Dimensions.get('window').width-20}
                tagsStyles={{blockquote:{marginLeft: 50}}}
                baseFontStyle={{fontSize: 18*fontSizeRatio, fontFamily: 'baomoi-regular', color:textColor, lineHeight:20*fontSizeRatio }}/>

            }

            <View style={{flexDirection: 'row', marginTop : 20}}>

                  <TouchableOpacity style={{alignItems: 'center', justifyContent:'center', alignItems:'center',flex: 1, flexDirection: 'row', backgroundColor:'#cc0000'}}
                                    onPress={() => Linking.openURL(this.state.Article.source_link)}>
                      <Icon
                        name='share-2'
                        type='feather'
                        color='white'
                        size={30}
                      />
                      <BaomoiText style={{color:'#ffffff',fontSize: 22, marginLeft: 5}}>LINK GỐC</BaomoiText>
                  </TouchableOpacity>

                  <TouchableOpacity style={{alignItems: 'center', justifyContent:'center', alignItems:'center',flex: 1, flexDirection: 'row', backgroundColor:'#3b5998'}}
                                    onPress={this.onShare}>
                      <View style={{borderColor: 'white', backgroundColor: '#3b5998', width:30 , height: 30, borderRadius: 15, borderWidth: 1,
                                    alignItems:'center', justifyContent:'center'}}>
                          <Icon
                            name='sc-facebook'
                            type='evilicon'
                            color='white'
                            size={30}

                          />
                      </View>
                      <BaomoiText style={{color:'#ffffff',fontSize: 22, marginLeft: 5}}>CHIA SẺ</BaomoiText>
                  </TouchableOpacity>


            </View>



            <RecommendedList article={this.state.Article} navigation={this.props.navigation} ui={{textColor, backGround, fontSizeRatio}} currentCount={this.state.currentCount}/>
            <CommentList comments={this.state.comments} navigation={this.props.navigation} ui={{textColor, backGround, fontSizeRatio}} user={this.state.user}/>

          </ScrollView>

          <CommentModal scrollView={this.scrollView} article={this.state.Article} commentLength={this.state.comments.length} onFetch={this.fetchComment} user={this.state.user} navigation={this.props.navigation}/>



        </View>
        )}
      </Consumer>

        );
    }
    textStyle = (myColor, r) => {
       return {
         flexDirection: 'row',
         flexWrap: 'wrap',
         alignItems: 'flex-start',
         flex: 1,

           h3: {
             marginTop: 10,
             color: myColor,
             fontSize: 22*r,
             fontWeight: 'bold',
             fontFamily: 'baomoi-regular'
           },
           a: {
              fontWeight: '300',
              fontSize: 18*r,
              color: '#FF3366', // make links coloured pink
            },
            em: {
              fontSize: 18*r,
              fontWeight: '300',
              fontStyle: 'italic'
            },
            li:{
            		fontSize:18*r,
            	},
            ol:{
            		fontSize:18*r,
            	},
            ul:{
          		fontSize:18*r,
          	},
            blockquote:{

              marginLeft: 50
            }
         }
     }
    renderNode(node, index, siblings, parent, defaultRenderer) {

      if (node.name === 'img') {
      const{ src, height } = node.attribs;
      console.log(src)
      Image.getSize(src, (w, h) => {
        if( h < w )
          h = 300
        const imageWidth = screenWidth - 20;
        return (
          <View>
            <Image
              key={index}
              style={{ width: imageWidth, height: h }}
              source={{ uri: src }}
              resizeMode='contain'/>
          </View>
        );

      },(err) => {
          console.log('err', err)
          return (
            <View>
            <Image
              key={index}
              style={{ width: screenWidth-20, height: 300 }}
              source={{ uri: src }}
              resizeMode='cover'/>
            </View>
          )
        })

      }

        if (node.children && node.children.length > 0 && node.children[0].name === 'iframe') {
          return (
            <View>
              <WebView source={{uri : node.children[0].attribs.src}} style={{width:screenWidth-20, height: 300}}/>
            </View>
          )
        }

   }
};

const styles = StyleSheet.create({

});
