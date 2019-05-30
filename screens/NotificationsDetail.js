import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    SafeAreaView,


} from 'react-native';
import HTML from 'react-native-render-html'
import { Avatar, Card, Icon, Button, Divider, Badge } from 'react-native-elements';
import {Consumer} from '../context/context.js';

export default class NotificationsDetail extends Component {
    constructor(props){
      super(props)
      this.state={noti : {}}
    }
    componentWillMount(){
      this.setState({
          noti: this.props.navigation.getParam("data", "ERR"),
      })
    }

    static navigationOptions = ({navigation}) => {
        return {
            tabBarVisible: false,
            header: (
              <Consumer>
                {({backGround, textColor}) => (
                    <SafeAreaView
                        style={{
                            height: 50,
                            flexDirection: "row",
                            backgroundColor: backGround,
                            alignItems:'center',
                            borderBottomWidth: 1,
                            borderBottomColor: '#C6C3BC',

                        }}
                    >
                        <View style={{flex: 1, alignItems: "flex-start"}}>
                            <Icon
                                name='chevron-left'
                                size={35}
                                color={textColor}
                                onPress={() => {
                                    navigation.goBack()
                                }}
                            />
                        </View>
                        <View style={{flex: 1}}></View>
                    </SafeAreaView>
                )}
            </Consumer>
            )
        }
    }

    render() {
        return (
          <Consumer>
            {({textColor, fontSizeRatio}) => (
            <ScrollView style={styles.container}>
            <Text style={{textAlign: 'center', fontFamily: 'baomoi-regular', fontSize: 24*fontSizeRatio, color: textColor, fontWeight:'bold'}}>{this.state.noti.title.rendered}</Text>
            <HTML
              alterChildren = { (node) => {
                  if (node.name === 'iframe') {
                      delete node.attribs.width;
                      delete node.attribs.height;
                  }
                  return node.children;
              }}
              html={this.state.noti.content.rendered}
              imagesMaxWidth={Dimensions.get('window').width-20}
              onLinkPress={(event, href)=>{
                Linking.openURL(href)
              }}
              ignoredStyles={['width', 'height', 'max-width']}
              staticContentMaxWidth={Dimensions.get('window').width-20}
              tagsStyles={{blockquote:{marginLeft: 50}}}
              baseFontStyle={{fontSize: 20*fontSizeRatio, fontFamily: 'baomoi-regular', color:textColor, lineHeight:23*fontSizeRatio }}/>
            </ScrollView>
            )}
          </Consumer>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    }
})
