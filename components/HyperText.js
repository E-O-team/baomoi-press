
'use strict'
import React from 'react';
import {
  Text,
  WebView,
  View,
  Linking,
  Dimensions,
  StyleSheet
} from 'react-native';
import _ from 'lodash';
import {Video} from 'expo';
import { MaterialIcons, Octicons } from '@expo/vector-icons';
import {Icon} from 'react-native-elements';
import {Consumer} from '../context/context.js';
import VideoPlayer from '@expo/videoplayer';



const screenWidth = Dimensions.get('window').width;

/**
 * Adds links to text with without HTML tags
 * 'This will turn into a link: http://www.facebook.com'
 * Use HTMLView for actual HTML.
 */
export default class HyperText extends React.Component {
  constructor(){
    super()
    this.state={
                mute: false,
            		fullScreen: false,
            		shouldPlay: true,
                }
  }

  componentWillMount () {
    this.blurSubscription =
      this.props.navigation.addListener(
        'willBlur',
        () => {
          if (this.state.shouldPlay) {
            this.handlePlayAndPause()
          }
        }
      )
  }
  componentWillUnmount () {
    this.blurSubscription.remove()
  }

  handlePlayAndPause = () => {
		this.setState(prevState => ({
			shouldPlay: !prevState.shouldPlay
		}));
	}

	handleVolume = () => {
		this.setState(prevState => ({
			mute: !prevState.mute,
		}));
	}
  onShouldStartLoadWithRequest = (navigator) => {
      if (navigator.url.indexOf('embed') !== -1
      ) {
          return true;
      } else {
          this.videoPlayer.stopLoading(); //Some reference to your WebView to make it stop loading that URL
          return false;
      }
  }
  render() {
    const Hyper = this
    const { width } = Dimensions.get('window');
    // Check if nested content is a plain string
    if (typeof this.props.children === 'string') {

      // Split the content on space characters
      var words = this.props.children.split(/\s/);

      // Loop through the words
      var contents = words.map(function(word, i) {

        // Space if the word isn't the very last in the set, thus not requiring a space after it
        var separator = i < (words.length - 1) ? ' ' : '';

        // The word is a URL, return the URL wrapped in a custom <Link> component
        if (word.match(/^https?\:\//)) {
            if(word.includes('youtu.be')) word = word.replace("youtu.be/", "youtube.com/embed/")
            console.log(word)

            return     <View style={{ width:screenWidth, height: (screenWidth)*9/16 }} key={i}>
                        {
                          Hyper.state.shouldPlay ? <WebView
                                                      key={i}
                                                      style={{flex:1}}
                                                      ref={(ref) => { Hyper.videoPlayer = ref;}}
                                                      scalesPageToFit={true}
                                                      source={{html: '<html><meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" /><iframe src="'+word+'?autoplay=1&modestbranding=1&playsinline=1&showinfo=0&rel=0" frameborder="0" style="overflow:hidden;overflow-x:hidden;overflow-y:hidden;height:100%;width:100%;position:absolute;top:0px;left:0px;right:0px;bottom:0px" height="100%" width="100%"></iframe></html>'}}
                                                      allowsInlineMediaPlayback={true}
                                                      mediaPlaybackRequiresUserAction={false}
                                                      onShouldStartLoadWithRequest={Hyper.onShouldStartLoadWithRequest} //for iOS
                                                      onNavigationStateChange ={Hyper.onShouldStartLoadWithRequest} //for Android
                                                  />
                          : <View style={{backgroundColor:'black', flex: 1, alignItems:'center', justifyContent:'center'}}>
                              <Icon
                                  size={50}
                                  name='play-circle'
                                  type='font-awesome'
                                  color='white'
                                  onPress={()=> Hyper.handlePlayAndPause()}
                              />
                            </View>
                        }
                       </View>                  // control playback of video with true/false




        // The word is not a URL, return the word as-is
        }
        if (word.includes('mp4=')) {
           word = word.replace(new RegExp('mp4=', 'g'), '')
                      .replace("][/video]",'')
                      .replace(new RegExp('"', 'g'), '')
            console.log(word)
            return    <View style={styles.container} key={i}>
                				<View>
                						<Video
                							source={{ uri: word }}
                							shouldPlay={Hyper.state.shouldPlay}
                							resizeMode="cover"
                							style={{ width, height: (screenWidth)*9/16}}
                							isMuted={Hyper.state.mute}
                              useNativeControls={true}
                						/>

                					</View>
                      </View>
        // The word is not a URL, return the word as-is
        }
      });
    // The nested content was something else than a plain string
    // Return the original content wrapped in a <Text> component
    } else {
      console.log('Attempted to use <HyperText> with nested components. ' +
                   'This component only supports plain text children.');
      return <Text>{this.props.children}</Text>;
    }

    // Return the modified content wrapped in a <Text> component
    return (
      <View >
        {contents}
        <Consumer>
          {({textColor, backGround, fontSizeRatio}) => (
              <View style={{padding: 10}}>
              <Text style={{color: '#C0C0C0', fontSize: 16*fontSizeRatio, marginBottom: 5, fontFamily: 'baomoi-regular'}}>{this.props.article.taxonomy_source[0].name} - {this.props.moment}</Text>
              <Text style={{fontSize: 18*fontSizeRatio, fontWeight: 'bold',fontFamily: 'baomoi-regular', color: textColor}}>{this.props.article.title.plaintitle}</Text>


              </View>
          )}
        </Consumer>
      </View>
    );
  }

}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
   },
   controlBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 45,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: "rgba(0, 0, 0, 0.5)",
   }
});
