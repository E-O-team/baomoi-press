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
import { Divider, Icon } from 'react-native-elements';
import Moment from 'moment';
import {Consumer} from '../context/context.js'
import Post1Pic from './Articles/Post1Pic'
import moment from 'moment/min/moment-with-locales'
const defaultImg ='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png';

const screenWidth = Dimensions.get('window').width;
const videoHeightRatio = 9/16;
moment.locale('vi');

class Comment extends React.Component {
    constructor(){
      super()
      this.state={
        numberOfComments: 0
      }
    }

    componentDidMount() {
        fetch('https://baomoi.press/wp-json/wp/v2/comments?post=' + this.props.item.id)
        .then(res => res.json())
        .then(json => this.setState({
            numberOfComments: json.length,
        }))
    }
    render(){
        const item = this.props.item

        return(               <View style={{flexDirection: "row", alignItems: "center"}}>
                                {
                                  (this.state.numberOfComments !== 0)?
                                  <View>
                                      <BaomoiText style={{color: '#696969', fontSize: 15}}> - {this.state.numberOfComments} </BaomoiText>                                  :
                                      <Icon containerStyle={{marginTop: -2}} name='comment' type="evilicon" color='#696969' size={20}/>
                                  </View> : <View></View>
                                }
                              </View>
        )
    }
}

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
    Comments = (props) => {
        // fetch('https://baomoi.press/wp-json/wp/v2/comments?post=' + props.id)
        // .then(res => res.json())
        // .then(json => {
        //     if(json.length !== 0){
        //         return(
        //           <View style={{flexDirection: "row", alignItems: "center"}}>
        //               <BaomoiText style={{color: '#696969', fontSize: 15}}> - {json.length} </BaomoiText>
        //               <Icon containerStyle={{marginTop: -2}} name='comment' type="evilicon" color='#696969' size={20}/>
        //           </View>
        //         )
        //     }else{
        //         return null;
        //     }
        // }).catch(err => {
        //   return null
        // })
        return <Text>shit</Text>


    }

    return(
      <View style={{padding: 10}}>
        <Consumer>
          {({textColor, backGround, fontSizeRatio}) => (
            <View>
              <BaomoiText style={{fontSize: 16* this.props.ui.fontSizeRatio,color:'#003333', marginBottom: 15, fontWeight:'500'}}>TIN KHÁC</BaomoiText>
              {this.state.Articles && <FlatList
                    data={this.state.Articles}
                    renderItem={({ item , index}) =>
                    <Consumer>
                      {({textColor, backGround, fontSizeRatio}) => (
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
                                              <View style={{position:'absolute', opacity: 0.6}}>
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
                                                         <BaomoiText style={{color: '#696969', fontSize: 15}}>{item.taxonomy_source[0].name} - {moment(item.modified).fromNow()}</BaomoiText>
                                                      :
                                                          <BaomoiText style={{color: '#696969', fontSize: 15}}>{moment(item.modified).fromNow()}</BaomoiText>
                                                    }
                                                    <Comment item={item}/>
                                                </View>
                                                    <BaomoiText style={{ fontSize: 18*fontSizeRatio,color:textColor, fontWeight: '400'}}>{item.title.plaintitle}</BaomoiText>
                                          </View>
                                      </View> :

                                      <View style={{flex: 1, flexDirection: "row", alignItems:'center'}}>
                                          <View style={{flex: 2}}>
                                              <View style={{flexDirection: "row", alignItems:'center'}}>
                                                  {
                                                    (item.taxonomy_source[0])?
                                                       <BaomoiText style={{color: '#696969', fontSize: 15}}>{item.taxonomy_source[0].name} - {moment(item.modified).fromNow()}</BaomoiText>
                                                    :
                                                        <BaomoiText style={{color: '#696969', fontSize: 15}}>{moment(item.modified).fromNow()}</BaomoiText>
                                                  }
                                                  <Comment item={item}/>
                                              </View>
                                              <BaomoiText style={{fontSize: 20, fontWeight: '500',color: textColor}}>{item.title.plaintitle}</BaomoiText>
                                          </View>
                                          <Image
                                              source={{uri :item.thumb || defaultImg}}
                                              style={{height: 90, flex: 1, marginLeft: 5, borderRadius: 5}}
                                          />
                                      </View>
                                }
                                <Divider style={{ backgroundColor: '#e0e0e0', marginTop: 10, marginBottom: 10}} />

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
