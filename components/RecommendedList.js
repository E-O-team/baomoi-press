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
const defaultImg ='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png';

import { Divider } from 'react-native-elements';
import Moment from 'moment';
import {Consumer} from '../context/context.js'
const defaultImg ='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png';


export default class RecommendedList extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      firstTagArticle: [],
      secondTagArticle: [],
      Articles : [],
    }
  }
  componentWillMount(){
    this.fetch();
  }
  fetch = () => {

    if(this.props.article.tags.length != 0)
    {

    var tag_length = this.props.article.tags.length;
    var first_tag = Math.floor(Math.random() * tag_length);
    console.log(first_tag)


    fetch("https://baomoi.press/wp-json/wp/v2/posts?tags="+ this.props.article.tags[first_tag].toString())
    .then(res => res.json())
    .then(json => {
      if(json.length > 1) this.setState({
        Articles: this.state.Articles.concat(json[Math.floor(Math.random() * json.length)]),
    })
  })
    // .then(json => console.log(json))
    .catch(err => console.log(err))

    var second_tag = Math.floor(Math.random() * tag_length);
    while(second_tag == first_tag) second_tag = Math.floor(Math.random() * tag_length)
    console.log(second_tag)
    fetch("https://baomoi.press/wp-json/wp/v2/posts?tags="+ this.props.article.tags[second_tag].toString())
    .then(res => res.json())
    .then(json => {
      if(json.length > 1) this.setState({
        Articles: this.state.Articles.concat(json[Math.floor(Math.random() * json.length)]),
    })
  })
    // .then(json => console.log(json))
    .catch(err => console.log(err))
  }

    var prev_day = Moment().subtract(1, "days").toISOString();
    console.log(prev_day);

    fetch("https://baomoi.press/wp-json/wp/v2/posts?per_page=30&orderby=date&order=asc&after="+ prev_day)
    .then(res => res.json())
    .then(json => {
      console.log(this.state.Articles.length)
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

  contentCustomize = (article) =>{

      var title= "<h4>"+article.title.rendered+"</h4>"
      var excerpt = "<p>"+ article.excerpt.plainexcerpt +"</p>"
      return {title, excerpt}
  }
  render(){


    return(
      <View>

              <Text style={{fontSize: 30, textAlign: 'center',color:this.props.ui.textColor}}>Bài viết đề xuất</Text>
              {this.state.Articles && <FlatList
                    data={this.state.Articles}
                    renderItem={({ item }) =>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => this.props.navigation.push("Article", {
                            Article: item
                        })}
                    >
                        <View style={{flex: 1, flexDirection: "row", marginTop: 20}}>
                            <View style={{flex: 2}}>
                                <HTMLView value={this.contentCustomize(item).title} stylesheet={{h4:{color:this.props.ui.textColor, fontSize:22}}}/>
                            </View>
                            <Image
                                source={{uri :item.thumb || defaultImg}}
                                style={{height: 80, width: 180, flex: 1}}
                            />
                        </View>
                        <HTMLView value={this.contentCustomize(item).excerpt} stylesheet={{p :{fontSize: 12, marginTop: 5, color:this.props.ui.textColor}}}/>
                        <Divider style={{ backgroundColor: '#e0e0e0', marginTop:10 }} />
                    </TouchableOpacity>
                    }
                    keyExtractor={(item, index) => index.toString()}
                />
              }

<<<<<<< HEAD
=======
      <Text style={{fontSize: 30, textAlign: 'center'}}>Bài viết đề xuất</Text>
      {this.state.Articles && <FlatList
            data={this.state.Articles}
            renderItem={({ item }) =>
                <Tile
                    activeOpacity={1}

                    onPress={() => {
                      this.props.navigation.push("Article", {
                        Article: item
                    });
                  }
                  }
                    title={item.title.rendered}
                    titleStyle={{textAlign: "left"}}
                    imageSrc={{uri : item.thumb || defaultImg}}

                >
                    <HTMLView value={item.excerpt.plainexcerpt} />
                </Tile>
            }
            keyExtractor={(item, index) => index.toString()}
        />
      }
>>>>>>> 778c93381d6297b412570f0a125c3b9f13fd1165
        </View>


  )
  }


}
