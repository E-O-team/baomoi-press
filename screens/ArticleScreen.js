import React from 'react';
import { Text, View, ScrollView, Dimensions, WebView, StyleSheet, TouchableHighlight, Platform, Share } from 'react-native';
import HTMLView from 'react-native-htmlview';
import CommentList from '../components/CommentList';
import RecommendedList from '../components/RecommendedList';
import {Consumer, Provider} from '../context/context.js'

export default class ArticleScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            Article: {}
        }
    }
    componentWillMount() {
        this.setState({
            Article: this.props.navigation.getParam("Article", "ERR")
        })
    }
    render(){
        return(

          <ScrollView style={{ flex: 1 , backgroundColor: 'white', padding: 10}}>
            <Consumer>
              {({textColor}) => console.log(textColor)}
            </Consumer>
            <HTMLView
              value={this.state.title}
              stylesheet={styles}
              />
            <HTMLView
              value={this.state.Article.content.plaintext}
              stylesheet={styles}
              />
              <TouchableHighlight style={{alignItems: 'center', marginBottom:20}} onPress={() => this.props.navigation.navigate("OriginalUrl", {
                  OriginalUrl: this.state.Article.source_link
              })}>
                <View style={{alignItems: 'center',justifyContent:'center', width: 150, height: 30,backgroundColor:'red'}}>
                 <Text style={{color:'#ffffff',fontWeight:'800',}}>Link gốc</Text>
                </View>
              </TouchableHighlight>
            <TouchableHighlight style={{alignItems: 'center'}} onPress={this.onShare}>
              <View style={{alignItems: 'center',justifyContent:'center', width: 150, height: 50,backgroundColor:'#3b5998'}}>
               <Text style={{color:'#ffffff',fontWeight:'800',}}>Share</Text>
              </View>
            </TouchableHighlight>


            <CommentList article={this.state.Article}/>
            <RecommendedList article={this.state.Article} navigation={this.props.navigation}/>

          </ScrollView>

        );
    }
};
