
'use strict'
import React from 'react';
import {
  Text,
  WebView,
  View,
  Linking,
  Dimensions
} from 'react-native';
import _ from 'lodash';
import {Video} from 'expo';
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
      isPortrait : true
    }
  }
  switchPortrait = () => {
    this.setState({isPortrait:false})
  }

  render() {
    const Hyper = this
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

            return <WebView key={i}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            source={{uri : word}}
                            style={{width:screenWidth-20, height: (screenWidth-20)*9/16}}/>;
        // The word is not a URL, return the word as-is
        }
        if (word.includes('mp4=')) {
           word = word.replace(new RegExp('mp4=', 'g'), '')
                      .replace("][/video]",'')
                      .replace(new RegExp('"', 'g'), '')
            console.log(word)
            return    <VideoPlayer
                        videoProps={{
                          shouldPlay: true,
                          source: {
                            uri: word,
                          },
                          resizeMode: Video.RESIZE_MODE_COVER,

                        }}
                        isPortrait={Hyper.state.isPortrait}
                        switchToLanscape={Hyper.switchPortrait}
                        switchToPortrait={Hyper.switchPortrait}
                        playFromPositionMillis={0}
                      />
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
      </View>
    );
  }

}
