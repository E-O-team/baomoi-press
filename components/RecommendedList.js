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
} from 'react-native';
import HTMLView from 'react-native-htmlview';
import { BaomoiText } from '../components/StyledText';
import { Divider } from 'react-native-elements';
import Moment from 'moment';
import {Consumer} from '../context/context.js'
const defaultImg ='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png';


export default class RecommendedList extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      Articles : [],
    }
  }
  componentWillMount(){
    this.fetch()
  }
  fetch = () => {

    if(this.props.article.tags.length != 0)
    {

    var tag_length = this.props.article.tags.length;
    var first_tag = Math.floor(Math.random() * tag_length);


    fetch("https://baomoi.press/wp-json/wp/v2/posts?tags="+ this.props.article.tags[first_tag].toString())
    .then(res => res.json())
    .then(json => {
      if(json.length >= 1) this.setState({
        Articles: this.state.Articles.concat(json[Math.floor(Math.random() * json.length)]),
    })
  })
    // .then(json => console.log(json))
    .catch(err => console.log(err))

    var second_tag = Math.floor(Math.random() * tag_length);
    while(second_tag == first_tag && tag_length != 1) second_tag = Math.floor(Math.random() * tag_length)
    fetch("https://baomoi.press/wp-json/wp/v2/posts?tags="+ this.props.article.tags[second_tag].toString())
    .then(res => res.json())
    .then(json => {
      if(json.length >= 1) this.setState({
        Articles: this.state.Articles.concat(json[Math.floor(Math.random() * json.length)]),
    })
  })
    // .then(json => console.log(json))
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
          if(article.id === new_article.id) is_duplicated = true
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
      <View style={{padding: 10, borderColor: '#e0e0e0', borderWidth: 2}}>
        <Consumer>
          {({textColor, backGround, fontSizeRatio}) => (
            <View>
              <BaomoiText style={{fontSize: 30* fontSizeRatio, textAlign: 'center',color:textColor}}>Bài viết đề xuất</BaomoiText>
              {this.state.Articles && <FlatList
                    data={this.state.Articles}
                    renderItem={({ item }) =>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => {
                        this.props.navigation.push("Article", {
                            Article: item,
                            currentCount: this.props.currentCount
                        })

                      }}
                    >
                        <View style={{flex: 1, flexDirection: "row", marginTop: 20}}>
                            <View style={{flex: 2}}>
                              <BaomoiText style={{fontSize:18* fontSizeRatio, color: textColor}}>{item.title.plaintitle}</BaomoiText>
                            </View>
                            <Image
                                source={{uri :item.thumb || defaultImg}}
                                style={{height: 80, width: 180, flex: 1}}
                            />
                        </View>
                            <BaomoiText style={{fontSize:15*fontSizeRatio, color: '#696969', marginTop: 10}} numberOfLines={2}>{item.excerpt.plainexcerpt}</BaomoiText>
                            <Divider style={{ backgroundColor: '#e0e0e0', marginTop:10 }} />
                    </TouchableOpacity>
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
