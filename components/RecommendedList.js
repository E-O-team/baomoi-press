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

import { ListItem, List, Tile, Card } from 'react-native-elements';
import Moment from 'moment';


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
  render(){


    return(
      <View>


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
                    imageSrc={{uri : item.thumb}}

                >
                    <HTMLView value={item.excerpt.plainexcerpt} />
                </Tile>
            }
            keyExtractor={(item, index) => index.toString()}
        />
      }
        </View>


  )
  }


}
