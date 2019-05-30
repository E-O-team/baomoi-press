
'use strict'
import React from 'react';
import {
  Text,
  WebView,
  View,
  Linking,
  Dimensions,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  Modal,
  Image,
  ScrollView,
} from 'react-native';
import {Icon, Divider} from 'react-native-elements';
import _ from 'lodash';
import {Video} from 'expo';
import axios from 'axios';
import { MaterialIcons, Octicons } from '@expo/vector-icons';
import CommentList from './CommentList'
import VideoArticle from './Articles/Video';
import { BaomoiText } from './StyledText';
import {Consumer} from '../context/context.js';
import moment from 'moment/min/moment-with-locales'

moment.locale('vi');
const defaultImg ='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png';




const screenWidth = Dimensions.get('window').width;

/**
 * Adds links to text with without HTML tags
 * 'This will turn into a link: http://www.facebook.com'
 * Use HTMLView for actual HTML.
 */
export default class VideoPlay extends React.PureComponent {
  constructor(){
    super()
    this.state={

                article : undefined,
                uri: undefined,
                shouldPlay : true,
                isLoading : true,
                otherVideos : [],
                isYoutubeVideo : false
                }
  }

  componentDidMount () {
    this.cancelTokenSource = axios.CancelToken.source()
    this.blurSubscription =
      this.props.navigation.addListener(
        'willBlur',
        () => {
          if (this.state.shouldPlay) {
            this.handlePlayAndPause()
          }
        }
      )

    this.fetchVideos()
  }
  componentWillUnmount () {
    this.blurSubscription.remove()
    this.cancelTokenSource && this.cancelTokenSource.cancel()
  }

  getUri = (content) => {
      const { width } = Dimensions.get('window');
      // Check if nested content is a plain string
      if (typeof content.content.plaintext === 'string') {
        var result;
        // Split the content on space characters
        var words = content.content.plaintext.split(/\s/);

        // Loop through the words
        var contents = words.map((word,i) => {

          // Space if the word isn't the very last in the set, thus not requiring a space after it
          var separator = i < (words.length - 1) ? ' ' : '';

          // The word is a URL, return the URL wrapped in a custom <Link> component
          if (word.match(/^https?\:\//)) {
              if(word.includes('youtu.be'))
              {
                  word = word.replace("youtu.be/", "youtube.com/embed/")
                 result = word
                 if(!this.state.isYoutubeVideo) this.setState({isYoutubeVideo : true})
              }


          // The word is not a URL, return the word as-is
          }
          if (word.includes('mp4=')) {
             const string=  word.replace(new RegExp('mp4=', 'g'), '')
                            .replace("][/video]",'')
                            .replace(new RegExp('"', 'g'), '')
                result = string

              if(this.state.isYoutubeVideo) this.setState({isYoutubeVideo : false})
          }

        });

        return result
      // The nested content was something else than a plain string
      // Return the original content wrapped in a <Text> component
      } else {
          console.log("can't find video source")
          return null
      }
  }

  fetchVideos = async() => {

     var Articles = []
     if(this.props.article.tags.length != 0)
     {

     var tag_length = this.props.article.tags.length;
     var first_tag = Math.floor(Math.random() * tag_length);


     await axios.get("https://baomoi.press/wp-json/wp/v2/posts?filter[post_format]=post-format-video&tags="+ this.props.article.tags[first_tag].toString(),{
                             cancelToken: this.cancelTokenSource.token
                         })
     .then(res => res.data)
     .then(json => {
       if(json.length > 1)
       {
           const first_article = json[Math.floor(Math.random() * json.length)]
           if(first_article.id !== this.props.article.id)
           Articles.push(first_article)
       }
     })
     .catch(err => console.log(err))



     var second_tag = Math.floor(Math.random() * tag_length);

     while(second_tag == first_tag && tag_length != 1) second_tag = Math.floor(Math.random() * tag_length)
     if(tag_length > 1)
     await axios.get("https://baomoi.press/wp-json/wp/v2/posts?filter[post_format]=post-format-video&tags="+ this.props.article.tags[second_tag].toString(),{
                               cancelToken: this.cancelTokenSource.token
                           })
       .then(res => res.data)
       .then(json => {
         if(json.length > 1){
             const second_article = json[Math.floor(Math.random() * json.length)]
             if(second_article.id !== this.props.article.id)
             Articles.push(second_article)
         }
      })
       .catch(err => console.log(err))


   }

     await axios.get("https://baomoi.press/wp-json/wp/v2/posts?filter[post_format]=post-format-video&per_page=20",{
         cancelToken: this.cancelTokenSource.token
     })
     .then(res => res.data)
     .then(json => {


          while(Articles.length < 10){

             var is_duplicated = false;
             var new_article = json[Math.floor(Math.random() * json.length)]
             Articles.forEach((article) => {
                 if(article){
                       if(article.id === new_article.id || this.props.article.id === new_article.id) is_duplicated = true
                   }
             })
             if(!is_duplicated){
                Articles.push(new_article)
             }
           }


     })
     this.setState({otherVideos : Articles})

   }

   _handleVideoRef = component => {
       this._videoRef = component;
       const uri = this.getUri(this.props.article)
       if(uri && this._videoRef && !uri.includes('youtu')){
        this._videoRef.loadAsync({uri : uri}, {}).then(res => { this.setState({isLoading: false})
                                                                this._videoRef.playAsync() })
                                                            }



    }

  handlePlayAndPause = () => {
        if(this._videoRef) this._videoRef.stopAsync()
		this.setState(prevState => ({
			shouldPlay: !prevState.shouldPlay
		}));
	}



     renderItem = ({item, index}) => (

         <View style={{paddingHorizontal: 10, paddingVertical: 20, borderBottomWidth: 1 , borderColor: '#e0e0e0'}}>
             <Consumer>
               {({textColor, backGround, fontSizeRatio}) => (
                     <TouchableWithoutFeedback
                         onPress={() => this.changeVideo(item)}
                     >
                         <View style={{flex: 1, flexDirection: "column", justifyContent: 'center'}}>
                               <View style={{alignItems: 'center', justifyContent:'center'}}>
                                   <Image
                                     key={index}
                                     style={{ width: screenWidth -40, height: (screenWidth - 40) * 9/16, borderRadius: 5, overflow: 'hidden', overlayColor: backGround}}
                                     source={{ uri: item.thumb || defaultImg }}
                                     />

                                     <View style={{position:'absolute', opacity:0.6}}>
                                       <Icon
                                           size={125}
                                           name='controller-play'
                                           type='entypo'
                                           color='white'
                                       />
                                     </View>
                                   <View style={{position:'absolute', opacity:0.8}}>
                                     <Icon
                                         size={120}
                                         name='controller-play'
                                         type='entypo'
                                         color='black'
                                     />
                                   </View>
                               </View>
                             <View>
                                 <View style={{flexDirection: "row", alignItems:'center', marginTop: 8}}>
                                     {
                                       (item.taxonomy_source[0])?
                                          <BaomoiText style={{color: '#C0C0C0', fontSize: 14}}>{item.taxonomy_source[0].name} - {moment(item.modified).fromNow().replace("trước", "").replace("một", "1")}</BaomoiText>
                                       :
                                           <BaomoiText style={{color: '#C0C0C0', fontSize: 14}}>{moment(item.modified).fromNow().replace("trước", "").replace("một", "1")}</BaomoiText>
                                     }
                                 </View>
                                 <BaomoiText style={{fontSize: 18, fontWeight: '500', fontFamily: 'baomoi-regular', color: textColor}}>{item.title.plaintitle}</BaomoiText>
                             </View>
                         </View>
                     </TouchableWithoutFeedback>
                 )}
             </Consumer>
         </View>
     )

  changeVideo = async(item) => {
      this.props.updateArticle(item)
      this.setState({isLoading : true})
      const uri = this.getUri(item)

      if(this._videoRef && !uri.includes('youtu')){
        await  this._videoRef.pauseAsync()
        await  this._videoRef.unloadAsync()

         this._videoRef.loadAsync({uri : uri}, {}).then(res => { this.setState({isLoading: false})
                                                                 this._videoRef.playAsync() })
      }

  }
  onRequestClose = () =>{
      this.setState({isLoading: false})
  }

  render() {
        const videoContent = (this.props.article && this.state.shouldPlay && this.state.isYoutubeVideo)?
                            <WebView
                                  style={{flex:1}}
                                  scalesPageToFit={true}
                                  source={{html: '<html><meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" /><iframe src="'+this.getUri(this.props.article)+'?autoplay=1&modestbranding=1&playsinline=1&showinfo=0&rel=0" frameborder="0" style="overflow:hidden;overflow-x:hidden;overflow-y:hidden;height:100%;width:100%;position:absolute;top:0px;left:0px;right:0px;bottom:0px" height="100%" width="100%"></iframe></html>'}}
                                  allowsInlineMediaPlayback={true}
                                  mediaPlaybackRequiresUserAction={false}
                                  onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest} //for iOS
                                  onNavigationStateChange ={this.onShouldStartLoadWithRequest} //for Android
                              />
                          : (this.props.article && this.state.isYoutubeVideo) ?
                          <View style={{backgroundColor:'black', flex: 1, alignItems:'center', justifyContent:'center'}}>
                              <Icon
                                  size={50}
                                  name='play-circle'
                                  type='font-awesome'
                                  color='white'
                                  onPress={()=> this.handlePlayAndPause()}
                              />
                            </View>
                          : (this.props.article) &&
                          <Video
                              ref = {this._handleVideoRef}
                              resizeMode="cover"
                              style={{flex: 1}}
                              useNativeControls={true}
                             />



    return (
           <View style={styles.container}>
              <Modal
               transparent={true}
               visible={(this.state.isLoading && !this.state.isYoutubeVideo)}
               onRequestClose={this.onRequestClose}>
                   <View style={{width: screenWidth, height: (screenWidth*9/16)+5, marginTop: 45}}>
                       <Image
                           source={{uri : 'https://ak6.picdn.net/shutterstock/videos/3374606/thumb/10.jpg'}}
                           style={{flex: 1}}
                           resizeMode='cover'/>
                   </View>
               </Modal>

                <View style={styles.videoContainer}>
                {videoContent}
                </View>

                <Consumer>
                  {({textColor, backGround, fontSizeRatio}) => (
                      <ScrollView style={{padding: 10, backgroundColor: backGround}}>

                              {this.props.article &&
                                <View>
                                  <Text style={{color: '#C0C0C0', fontSize: 16*fontSizeRatio, marginBottom: 5, fontFamily: 'baomoi-regular'}}>{this.props.article.taxonomy_source[0].name} - {moment(this.props.article.modified).fromNow().replace("trước", "").replace("một", "1")}</Text>
                                  <Text style={{fontSize: 18*fontSizeRatio, fontWeight: 'bold',fontFamily: 'baomoi-regular', color: textColor}}>{this.props.article.title.plaintitle}</Text>
                                </View>
                               }
                              <Divider style={{marginTop: 10, marginBottom: 10}}/>
                              <BaomoiText style={{fontSize: 16* fontSizeRatio,color:'#003333', marginBottom: 15, fontWeight:'500'}}>TIN KHÁC</BaomoiText>

                              <FlatList
                                data={this.state.otherVideos}
                                extraData={this.state.otherVideos}
                                renderItem={this.renderItem}
                                keyExtractor={(item, index) => item.id.toString()}
                                />

                              <CommentList comments={this.props.comments} navigation={this.props.navigation} ui={{textColor, backGround, fontSizeRatio}} user={this.props.user} setModalVisible={this.props.setModalVisible}/>

                      </ScrollView>
                    )}
                </Consumer>
           </View>
    );
  }

}

const styles = StyleSheet.create({
   container: {
      marginTop: 50,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
   },
   videoContainer: {
      width: screenWidth,
      height : screenWidth *9/16,
   }
});
