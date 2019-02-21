
'use strict'
import React from 'react';
import {
  Text,
  WebView,
  View,
  Dimensions
} from 'react-native';
import _ from 'lodash';


const screenWidth = Dimensions.get('window').width;

/**
 * Adds links to text with without HTML tags
 * 'This will turn into a link: http://www.facebook.com'
 * Use HTMLView for actual HTML.
 */
export default class HyperText extends React.Component {
  constructor(props){
    super(props);
}

  render() {
    var contents;

    if (_.isString(this.props.children)) {
      let tokens = this.props.children.split(/\s/);

      contents = _.map(tokens, (token, i) => {
        let hasSpace = i !== (tokens.length - 1);
        let maybeSpace = hasSpace ? ' ' : '';

        if (token.match(/^http\:\//)) {
          return (
            <WebView
            key={i}
            source={{uri : token}}
            style={{width:screenWidth,
            height: 500}}
            />
          );
        }
      });
    } else {
      console.warn('Attempted to use <HyperText> with nested components. ' +
                   'This component only supports plain text children.');
      return <Text {...this.props} />;
    }

    return (
      <View {...this.props}>
        {contents}
      </View>
    );
  }

}
