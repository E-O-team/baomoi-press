
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
  ScrollView
} from 'react-native';
import {Icon, Divider} from 'react-native-elements';
import _ from 'lodash';
import {Video} from 'expo';
import axios from 'axios';
import { MaterialIcons, Octicons } from '@expo/vector-icons';
import VideoArticle from './Articles/Video';
import { BaomoiText } from './StyledText';
import {Consumer} from '../context/context.js';
import moment from 'moment';

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
                otherVideos : [],
                isDirectFileExtensions : true
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
    this.setState({article : this.props.article}, () => this.getUri())
    this.fetchVideos()
  }
  componentWillUnmount () {
    this.blurSubscription.remove()
    this.cancelTokenSource && this.cancelTokenSource.cancel()
  }

  handlePlayAndPause = () => {
		this.setState(prevState => ({
			shouldPlay: !prevState.shouldPlay
		}));
	}

    getUri = () => {
        const component = this
        const { width } = Dimensions.get('window');
        // Check if nested content is a plain string
        if (typeof this.state.article.content.plaintext === 'string') {

          // Split the content on space characters
          var words = this.state.article.content.plaintext.split(/\s/);

          // Loop through the words
          var contents = words.map(function(word, i) {

            // Space if the word isn't the very last in the set, thus not requiring a space after it
            var separator = i < (words.length - 1) ? ' ' : '';

            // The word is a URL, return the URL wrapped in a custom <Link> component
            if (word.match(/^https?\:\//)) {
                if(word.includes('youtu.be')) word = word.replace("youtu.be/", "youtube.com/embed/")
                component.setState({uri :word, isDirectFileExtensions : false})
            // The word is not a URL, return the word as-is
            }
            if (word.includes('mp4=')) {
               word = word.replace(new RegExp('mp4=', 'g'), '')
                          .replace("][/video]",'')
                          .replace(new RegExp('"', 'g'), '')
                component.setState({uri: word, isDirectFileExtensions: true})
            }

          });
        // The nested content was something else than a plain string
        // Return the original content wrapped in a <Text> component
        } else {
            console.log("can't find video source")
        }
    }

    fetchVideos = async() => {
        var Article = []
        axios.get("https://baomoi.press/wp-json/wp/v2/posts?filter[post_format]=post-format-video&per_page=10",{
           cancelToken: this.cancelTokenSource.token
       })
       .then(res => res.data)
       .then(json => {
         // while(this.state.Articles.length < 5){
         //
         //     var is_duplicated = false;
         //     var new_article = json[Math.floor(Math.random() * json.length)]
         //     Articles.forEach((article) => {
         //         if(article){
         //               if(article.id === new_article.id || this.props.article.id === new_article.id) is_duplicated = true
         //           }
         //     })
         //     if(!is_duplicated){
         //        Articles.push(new_article)
         //     }
         // }
         this.setState({otherVideos : json})
       })

     }

     renderItem = ({item, index}) => (
         <View style={{padding: 10}}>
             <TouchableWithoutFeedback
                 onPress={() => this.changeVideo(item)}
             >
                 <View style={{flex: 1, flexDirection: "column", justifyContent: 'center'}}>
                       <View style={{alignItems: 'center', justifyContent:'center'}}>
                           <Image
                             key={index}
                             style={{ width: screenWidth, height: screenWidth * 9/16}}
                             source={{ uri: item.thumb || defaultImg }}
                             resizeMode='cover'/>
                           <View style={{position:'absolute', opacity:0.6}}>
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
                                  <BaomoiText style={{color: '#696969', fontSize: 14}}>{item.taxonomy_source[0].name} - {moment(item.modified).fromNow().replace("trước", "").replace("một", "1")}</BaomoiText>
                               :
                                   <BaomoiText style={{color: '#696969', fontSize: 14}}>{moment(item.modified).fromNow().replace("trước", "").replace("một", "1")}</BaomoiText>
                             }
                         </View>
                         <BaomoiText style={{fontSize: 20, fontWeight: '500', fontFamily: 'baomoi-regular', color: 'black'}}>{item.title.plaintitle}</BaomoiText>
                     </View>
                 </View>
             </TouchableWithoutFeedback>


         </View>
     )

  changeVideo = (item) => {
      if(this._videoRef) {
          this._videoRef.setPositionAsync(0)
          this._videoRef.unloadAsync()
      }
      this.setState({article : item}, () => this.getUri() )
  }

  render() {
        console.log(this.state.uri)
        const videoContent = (this.state.uri && this.state.shouldPlay && !this.state.isDirectFileExtensions)?
                            <WebView
                                  style={{flex:1}}
                                  scalesPageToFit={true}
                                  source={{html: '<html><meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" /><iframe src="'+this.state.uri+'?autoplay=1&modestbranding=1&playsinline=1&showinfo=0&rel=0" frameborder="0" style="overflow:hidden;overflow-x:hidden;overflow-y:hidden;height:100%;width:100%;position:absolute;top:0px;left:0px;right:0px;bottom:0px" height="100%" width="100%"></iframe></html>'}}
                                  allowsInlineMediaPlayback={true}
                                  mediaPlaybackRequiresUserAction={false}
                                  onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest} //for iOS
                                  onNavigationStateChange ={this.onShouldStartLoadWithRequest} //for Android
                              />
                          : (this.state.uri && !this.state.isDirectFileExtensions) ?
                          <View style={{backgroundColor:'black', flex: 1, alignItems:'center', justifyContent:'center'}}>
                              <Icon
                                  size={50}
                                  name='play-circle'
                                  type='font-awesome'
                                  color='white'
                                  onPress={()=> this.handlePlayAndPause()}
                              />
                            </View>
                          : (this.state.uri) &&
                          <Video
                              source={{ uri: this.state.uri }}
                              ref = { ref => this._videoRef = ref}
                              shouldPlay={this.state.shouldPlay}
                              posterSource={{uri: 'https://i.ytimg.com/vi/n_ZvkrLkQxY/hqdefault.jpg'}}
                              usePoster={true}
                              resizeMode="cover"
                              style={{flex: 1}}
                              useNativeControls={true}
                             />



    return (
           <View style={styles.container}>
                <View style={styles.videoContainer}>
                {videoContent}
                </View>
                <Consumer>
                  {({textColor, backGround, fontSizeRatio}) => (
                      <ScrollView style={{padding: 10}}>

                              {this.state.article &&
                                <View>
                                  <Text style={{color: '#C0C0C0', fontSize: 16*fontSizeRatio, marginBottom: 5, fontFamily: 'baomoi-regular'}}>{this.state.article.taxonomy_source[0].name} - {moment(this.state.article.modified).fromNow().replace("trước", "").replace("một", "1")}</Text>
                                  <Text style={{fontSize: 18*fontSizeRatio, fontWeight: 'bold',fontFamily: 'baomoi-regular', color: textColor}}>{this.state.article.title.plaintitle}</Text>
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
                      </ScrollView>
                    )}
                </Consumer>
           </View>
    );
  }

}

const styles = StyleSheet.create({
   container: {
      marginTop: 70,
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
   },
   videoContainer: {
      width: screenWidth,
      height : screenWidth *9/16,
   }
});
