import React from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    SafeAreaView,
    Dimensions
} from 'react-native';
import HTMLView from 'react-native-htmlview';
import { BaomoiText } from '../components/StyledText';
import { Divider,    Tile, Icon } from 'react-native-elements';
import Moment from 'moment';
import {Consumer} from '../context/context.js'
const defaultImg ='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png';

const screenWidth = Dimensions.get('window').width;
const videoHeightRatio = 9/16;

export default class RecommendedList extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      Articles : [],
    }
  }
  componentWillMount(){
    if(this.props.article.format === 'video') this.fetchVideos()
    else this.fetchArticles()

  }
  fetchArticles = () => {

    if(this.props.article.tags.length != 0)
    {

    var tag_length = this.props.article.tags.length;
    var first_tag = Math.floor(Math.random() * tag_length);


    fetch("https://baomoi.press/wp-json/wp/v2/posts?tags="+ this.props.article.tags[first_tag].toString())
    .then(res => res.json())
    .then(json => {
      if(json.length > 1)
      {
          const first_article = json[Math.floor(Math.random() * json.length)]
          if(first_article.id !== this.props.article.id)
          this.setState({
            Articles: this.state.Articles.concat(first_article),
          })
      }
    })
    .catch(err => console.log(err))

    var second_tag = Math.floor(Math.random() * tag_length);
    while(second_tag == first_tag && tag_length != 1) second_tag = Math.floor(Math.random() * tag_length)
    if(tag_length > 1)
      fetch("https://baomoi.press/wp-json/wp/v2/posts?tags="+ this.props.article.tags[second_tag].toString())
      .then(res => res.json())
      .then(json => {
        if(json.length > 1){
            const second_article = json[Math.floor(Math.random() * json.length)]
            if(second_article.id !== this.props.article.id)
            this.setState({
             Articles: this.state.Articles.concat(second_article),
            })
        }
     })
      .catch(err => console.log(err))
  }

    var prev_day = Moment().subtract(1, "days").toISOString();

    fetch("https://baomoi.press/wp-json/wp/v2/posts?per_page=30&orderby=date&order=asc&after="+ prev_day)
    .then(res => res.json())
    .then(json => {

      while(this.state.Articles.length < 10){

        var is_duplicated = false;
        var new_article = json[Math.floor(Math.random() * json.length)]
        this.state.Articles.forEach((article) => {
          if(article.id === new_article.id || this.props.article.id === new_article.id) is_duplicated = true
        })
        if(!is_duplicated)
       this.setState({
        Articles: this.state.Articles.concat(new_article),
        })

      }
    })


  }

  fetchVideos = () => {

    fetch("https://baomoi.press/wp-json/wp/v2/posts?filter[post_format]=post-format-video&per_page=10")
    .then(res => res.json())
    .then(json => {

      while(this.state.Articles.length < 5){

        var is_duplicated = false;
        var new_article = json[Math.floor(Math.random() * json.length)]
        this.state.Articles.forEach((article) => {
          if(article.id === new_article.id || this.props.article.id === new_article.id) is_duplicated = true
        })
        if(!is_duplicated)
       this.setState({
        Articles: this.state.Articles.concat(new_article),
        })

      }
    })

  }

  render(){


    return(
      <View style={{padding: 10}}>
        <Consumer>
          {({textColor, backGround, fontSizeRatio}) => (
            <View>
              <BaomoiText style={{fontSize: 25* this.props.ui.fontSizeRatio, textAlign: 'center',color:this.props.ui.textColor, marginBottom: 10, textDecorationLine: 'underline'}}>Tin đề xuất</BaomoiText>
              {this.state.Articles && <FlatList
                    data={this.state.Articles}
                    renderItem={({ item }) =>
                    <Consumer>
                      {({textColor, fontSizeRatio}) => (
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => this.props.navigation.push("Article", {
                                Article: item,
                                currentCount: this.props.currentCount
                            })}
                        >

                              {(item.format === 'video') ?
                                      <View style={{flex: 1, flexDirection: "column", justifyContent: 'center', marginTop: 20}}>
                                          <View style={{alignItems: 'center', justifyContent:'center'}}>
                                              <Image
                                                style={{ width: screenWidth-20, height: ((screenWidth-20) * 9/16), borderRadius: 10}}
                                                source={{ uri: item.thumb || defaultImg }}
                                                resizeMode='cover'/>
                                              <View style={{position:'absolute'}}>
                                                <Icon
                                                    size={80}
                                                    name='play-circle'
                                                    type='font-awesome'
                                                    color='#C0C0C0'
                                                />
                                              </View>


                                          </View>
                                          <View>
                                              <BaomoiText style={{marginTop:10, fontSize: 18*fontSizeRatio,color:textColor, fontWeight: '400'}}>{item.title.plaintitle}</BaomoiText>
                                          </View>
                                      </View> :

                                      <View style={{flex: 1, flexDirection: "row", marginTop: 10, marginBottom: 10}}>
                                        <View style={{flex: 2}}>

                                            <BaomoiText style={{fontSize: 18*fontSizeRatio, fontWeight: '400',color: textColor}}>{item.title.plaintitle}</BaomoiText>
                                        </View>
                                        <Image
                                            source={{uri :item.thumb || defaultImg}}
                                            style={{height: 80, flex: 1, width: 180, borderRadius: 5}}
                                        />
                                      </View>
                                }


                        </TouchableOpacity>
                      )}
                    </Consumer>
                    }
                    keyExtractor={(item, index) => index.toString()}
                />
              }
              </View>
              )}
            </Consumer>
        </View>


  )
  }


}
