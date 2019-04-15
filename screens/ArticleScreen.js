import React from 'react';
import { Text, View, Linking, AsyncStorage,Keyboard,ScrollView,TextInput, Dimensions, WebView, StyleSheet, TouchableOpacity, TouchableHighlight, Platform, Share, Image, PixelRatio, Modal, Animated, Switch } from 'react-native';
import HTMLView from 'react-native-htmlview';
import HTML from 'react-native-render-html';
import CommentList from '../components/CommentList';
import RecommendedList from '../components/RecommendedList';
import AuthorSubscription from '../components/AuthorSubscription';
import CommentModal from '../components/CommentModal';
import HyperText from '../components/HyperText'
import {Consumer, Provider} from '../context/context.js';
import {Icon, Divider} from 'react-native-elements';
import {SafeAreaView} from 'react-navigation';
import { FacebookAds } from 'expo';

import moment from 'moment/min/moment-with-locales'
import axios from 'axios';
import { BaomoiText } from '../components/StyledText';
import BannerAd from '../components/Ads/BannerAd';
import FacebookRectangle from '../components/Ads/FacebookAd/FacebookRectangle'
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
moment.locale('vi');

HEADER_MAX_HEIGHT = 100;
HEADER_MIN_HEIGHT = 50;



export default class ArticleScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            Article: {},
            currentCount : 1,
            intervalId: undefined,
            user: undefined,
            comments: [],
            scrollY: new Animated.Value(0),
            PopUpAds: [],
            TopViewHeight: 100,
            settingModalVisible: false,
            commentModalVisible: false,
            commentParent: 0
        }
    }
    static navigationOptions = ({navigation}) => {
        return {
            title: "Article",
            tabBarVisible: false,
            header: null
        }
    }
    componentWillMount() {
        this.cancelTokenSource = axios.CancelToken.source()
        this.setState({
            Article: this.props.navigation.getParam("Article", "ERR"),
        },() => {
          this.fetchComment()
          this.setAds()
          this.updateUser()
          this.getTimeCount()
        })



    }
    getTimeCount = async() => {

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
       if(this.state.currentCount % 180 == 0)
       {
         //add point for user

         if(this.state.user !== null)
         {
             axios({
                 method: "GET",
                 url: 'https://baomoi.press/wp-json/wp/v2/add_exp?ammount=1',
                 headers: {'Authorization': 'Bearer ' + this.state.user.token},
             },{cancelToken: this.cancelTokenSource.token})
         }
       }

       if(this.state.currentCount >= 7200) this.setState({currentCount: 1})


    }



    componentWillUnmount() {
      // use intervalId from the state to clear the interval
       clearInterval(this.state.intervalId)
       AsyncStorage.setItem('seconds', this.state.currentCount.toString())
       this.cancelTokenSource && this.cancelTokenSource.cancel()
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
      const request_length = this.state.comments.length + 20
      fetch("https://baomoi.press/wp-json/wp/v2/comments?post="+this.state.Article.id +"&per_page="+request_length.toString(), {
          cancelToken: this.cancelTokenSource.token
      })
      .then(res => res.json())
      .then(json => {
        this.setState({comments : json}, () => {if(this.state.comments.length >= request_length) this.fetchComment()  })
      })
      // .then(json => console.log(json))
      .catch(err => console.log(err))
    }
    setCommentModalVisible = (visible, parent) => {
      this.setState({commentModalVisible: visible, commentParent: parent})
    }
    updateUser = async () => {
      this.setState({
          user: JSON.parse(await AsyncStorage.getItem('user'))
      })
    }
    setAds = () => {
      //Get PopUpAds
      //this.setState({PopUpAds : AsyncStorage.getItem('pop-up-Ads')})

      //Add Ads in the middle of content'
      var article = this.state.Article
      const string = this.state.Article.content.plaintext
      if(string.indexOf('<ads>') == -1) {
        var middle_position = Math.floor(string.length /2)
        var match = /\r|\n/.exec(string.slice(middle_position));
        if(match)
        {
          const new_content = [string.slice(0, middle_position+match.index), ' <ads></ads> ', string.slice(middle_position+match.index)].join('');
          article.content.plaintext = new_content
          this.setState({Article: article})
        }
      }
      //
    }


    render(){
      const headerSource = this.state.scrollY.interpolate({
        inputRange: [0, this.state.TopViewHeight-10, this.state.TopViewHeight -9],
        outputRange: [0, 0 , 1],
        extrapolate: 'clamp',
      });
        return(
      <Consumer>
        {({textColor, backGround, fontSizeRatio}) => (
        <View style={{backgroundColor: backGround, flexDirection:'column', flex: 1}}>
          <Animated.View style={{
                                  position:'absolute',
                                  top: 20,
                                  right: 0,
                                  left: 0,
                                  height: 50,
                                  zIndex: 1,
                                  backgroundColor: backGround,
                                  alignItems:'center',
                                  flexDirection: "row",
                                  flex: 1,
                                  borderBottomWidth: 0.5,
                                  borderBottomColor: '#e0e0e0'
                                  }}>
              <View style={{flex: 1, alignItems:'flex-start'}}>
                <Icon
                  name='chevron-left'
                  size={35}
                  color='#696969'
                  onPress={()=>this.props.navigation.goBack()}
                />
              </View>
              <Animated.View style={{opacity: headerSource, flex: 5}}>
                <AuthorSubscription taxonomy_source={this.state.Article.taxonomy_source[0]} onHeader={true} user={this.state.user} updateUser={this.updateUser}/>
              </Animated.View>

              <View style={{flex:1, alignItems: 'flex-end', justifyContent: 'center'}}>
                <Icon
                  name='dots-three-vertical'
                  type='entypo'
                  size={25}
                  color='#696969'
                  style={{marginRight: 5}}
                  onPress={()=>this.setState({settingModalVisible: true})}
                />

                <Modal
                   transparent={true}
                   visible={this.state.settingModalVisible}
                   onRequestClose={() => {}}
                   >
                    <TouchableOpacity style={{backgroundColor: 'rgba(0,0,0,0.5)',flex: 1, alignItems:'flex-end'}} onPress={()=>this.setState({settingModalVisible: false})}>
                        <Consumer>
                          {({changeDay, changeNight, backGround, changeRatio, fontSizeRatio, nightMode, switchMode, textColor}) => (
                             <View style={{
                                           height: 150,
                                           width: 150,
                                           backgroundColor: 'white',
                                           justifyContent:'center',
                                           marginTop: 50,
                                           marginRight: 10,
                                           borderRadius: 10
                                         }}>
                                  <View style={{flexDirection:'row', height: 75}}>
                                      <TouchableOpacity style={{flex:1, borderRightColor:'#696969',borderRightWidth: 1, alignItems:'center', justifyContent:'center'}} onPress={() => changeRatio(0.8)}>
                                        <BaomoiText style={{fontSize: 16}}>Aa</BaomoiText>
                                      </TouchableOpacity>
                                      <TouchableOpacity style={{flex:1, alignItems:'center', justifyContent:'center'}} onPress={() => changeRatio(1.2)}>
                                        <BaomoiText style={{fontSize: 20, fontWeight: '500'}}>Aa</BaomoiText>
                                      </TouchableOpacity>
                                  </View>
                                  <Divider style={{backgroundColor:'#696969'}}/>
                                  <View style={{flexDirection:'row', height: 75, alignItems:'center', justifyContent:'space-between', padding: 5}}>
                                  <BaomoiText style={{fontSize: 16}}>Giao diện</BaomoiText>
                                  <Switch
                                      onValueChange={switchMode}
                                      value={nightMode}
                                  />
                                  </View>

                              </View>
                        )}
                        </Consumer>

                    </TouchableOpacity>
                </Modal>

              </View>



          </Animated.View>

          <ScrollView ref={(scrollView) => { this.scrollView = scrollView }} style={{ height: this.state.height - 40 , backgroundColor: backGround , marginTop: 70}}
                            scrollEventThrottle={16}
                            onScroll={Animated.event(
                            [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}]
                            )}>


                <View onLayout={(event) => {
                                  var {x, y, width, height} = event.nativeEvent.layout;
                                  this.setState({TopViewHeight : height})
                                }} >
                  {
                    (this.state.Article.format === 'video')? <View style={{marginTop: 10}}></View>
                    :
                    <View style={{padding: 10}}>
                      <Text style={{fontSize: 24*fontSizeRatio, fontWeight: 'bold',fontFamily: 'baomoi-regular', color: textColor, marginBottom: 5}}>{this.state.Article.title.plaintitle}</Text>

                      <AuthorSubscription taxonomy_source={this.state.Article.taxonomy_source[0]} onHeader={false} user={this.state.user} updateUser={this.updateUser} moment={moment(this.state.Article.modified).fromNow().replace("trước", "").replace("một", "1")}/>
                    </View>

                  }

                  </View>


                <View style={{marginTop: 10}}>
                {
                  (this.state.Article.format === 'video')?
                  <HyperText navigation={this.props.navigation} article={this.state.Article} moment={moment(this.state.Article.modified).fromNow().replace("trước", "").replace("một", "1")}>
                  {this.state.Article.content.plaintext}
                  </HyperText> :
                  <View style={{padding: 10}}>
                      <HTML
                        html={this.state.Article.excerpt.custom_excerpt}
                        imagesMaxWidth={Dimensions.get('window').width-20}
                        onLinkPress={(event, href)=>{
                          Linking.openURL(href)
                        }}
                        ignoredStyles={['width', 'height', 'max-width']}
                        staticContentMaxWidth={Dimensions.get('window').width-20}
                        tagsStyles={{blockquote:{marginLeft: 50}, p: {margin: 5}}}
                        baseFontStyle={{fontSize: 19*fontSizeRatio, fontWeight:'500', fontFamily: 'baomoi-regular', color:textColor, lineHeight:23*fontSizeRatio }}/>

                      <View style={{height: 15}}></View>

                      <HTML
                        alterChildren = { (node) => {
                            if (node.name === 'iframe') {
                                delete node.attribs.width;
                                delete node.attribs.height;
                            }
                            return node.children;
                        }}
                        renderers= {
                          {

                               ads: (index) => <BannerAd key={index} size='rectangle' AdPosition='Content(Giữa bài viết)'/>

                          }
                          }
                        html={this.state.Article.content.plaintext}
                        imagesMaxWidth={Dimensions.get('window').width-20}
                        onLinkPress={(event, href)=>{
                          Linking.openURL(href)
                        }}
                        ignoredStyles={['width', 'height', 'max-width']}
                        staticContentMaxWidth={Dimensions.get('window').width-20}
                        tagsStyles={{blockquote:{marginLeft: 50}, p: {margin: 5}}}
                        baseFontStyle={{fontSize: 20*fontSizeRatio, fontFamily: 'baomoi-regular', color:textColor, lineHeight:23*fontSizeRatio }}/>
                  </View>

                }
                </View>


            <View style={{flexDirection: 'row', marginTop : 20, marginBottom: 10}}>

                  <TouchableOpacity style={{height: 40, alignItems: 'center', justifyContent:'center', alignItems:'center',flex: 1, flexDirection: 'row', backgroundColor:'#cc0000'}}
                                    onPress={() => Linking.openURL(this.state.Article.source_link)}>
                      <Icon
                        name='share-2'
                        type='feather'
                        color='white'
                        size={30}

                      />
                      <BaomoiText style={{color:'#ffffff',fontSize: 22, marginLeft: 5}}>LINK GỐC</BaomoiText>
                  </TouchableOpacity>

                  <TouchableOpacity style={{height: 40, alignItems: 'center', justifyContent:'center', alignItems:'center',flex: 1, flexDirection: 'row', backgroundColor:'#3b5998'}}
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
                <BannerAd size='rectangle' AdPosition='Content(Cuối bài viết)'/>

                <Divider style={{ backgroundColor: '#e0e0e0', height: 15, marginTop: 10}} />

                <RecommendedList article={this.state.Article} navigation={this.props.navigation} ui={{textColor, backGround, fontSizeRatio}} currentCount={this.state.currentCount}/>

                <CommentList comments={this.state.comments} navigation={this.props.navigation} ui={{textColor, backGround, fontSizeRatio}} user={this.state.user} setModalVisible={this.setCommentModalVisible}/>

          </ScrollView>


          <CommentModal scrollView={this.scrollView} article={this.state.Article} commentLength={this.state.comments.length} onFetch={this.fetchComment} user={this.state.user} commentParent={this.state.commentParent} modalVisible={this.state.commentModalVisible} setModalVisible={this.setCommentModalVisible} navigation={this.props.navigation}/>




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
};
