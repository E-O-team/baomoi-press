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
import BannerAd from './Ads/BannerAd'
import InterstitialAd from './Ads/InterstitialAd'
import {FacebookAds} from 'expo'
import ArticleAd from './Ads/ArticleAd'
import axios from 'axios';


import moment from 'moment/min/moment-with-locales'
const defaultImg ='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png';

const screenWidth = Dimensions.get('window').width;
const videoHeightRatio = 9/16;
moment.locale('vi');

class Comment extends React.PureComponent {
    constructor(){
      super()
      this.state={
        numberOfComments: 0
      }
    }

    componentDidMount() {
        this.cancelTokenSource = axios.CancelToken.source()
        this.fetchComment()

    }
    fetchComment = () => {
      const request_length = this.state.numberOfComments + 20
      axios.get("https://baomoi.press/wp-json/wp/v2/comments?post="+this.props.item.id +"&per_page="+request_length.toString(),{
          cancelToken: this.cancelTokenSource.token
      })
      .then(res => res.data)
      .then(json => {
        this.setState({numberOfComments : json.length}, () => {if(this.state.numberOfComments >= request_length) this.fetchComment()  })
      })
      // .then(json => console.log(json))
      .catch(err => console.log(err))
    }
    componentWillUnmount() {

       this.cancelTokenSource && this.cancelTokenSource.cancel()
    }
    render(){
        const item = this.props.item

        return(               <View style={{justifyContent:'center'}}>
                                {
                                  (this.state.numberOfComments !== 0)?
                                  <View style={{flexDirection: "row", alignItems: "center"}}>
                                      <Text style={{fontSize: 12, color: '#696969'}}> - {this.state.numberOfComments}</Text>
                                      <Icon containerStyle={{marginTop: -2}} name='comment' type="evilicon" color='#696969' size={20}/>
                                  </View> : <View></View>
                                }
                              </View>
        )
    }
}

export default class RecommendedList extends React.PureComponent{
  constructor(props){
    super(props);
    this.state = {
      Articles : [],
    }
  }
  componentWillMount(){
    this.cancelTokenSource = axios.CancelToken.source()
    if(this.props.article.format === 'video') this.fetchVideos()
    else this.fetchArticles()


  }
  fetchArticles = () => {

    if(this.props.article.tags.length != 0)
    {

    var tag_length = this.props.article.tags.length;
    var first_tag = Math.floor(Math.random() * tag_length);


    axios.get("https://baomoi.press/wp-json/wp/v2/posts?tags="+ this.props.article.tags[first_tag].toString(),{
        cancelToken: this.cancelTokenSource.token
    })
    .then(res => res.data)
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
      axios.get("https://baomoi.press/wp-json/wp/v2/posts?tags="+ this.props.article.tags[second_tag].toString(),{
          cancelToken: this.cancelTokenSource.token
      })
      .then(res => res.data)
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

    axios.get("https://baomoi.press/wp-json/wp/v2/posts?per_page=30&orderby=date&order=asc&after="+ prev_day,{
        cancelToken: this.cancelTokenSource.token
    })
    .then(res => res.data)
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

    axios.get("https://baomoi.press/wp-json/wp/v2/posts?filter[post_format]=post-format-video&per_page=10",{
        cancelToken: this.cancelTokenSource.token
    })
    .then(res => res.data)
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
  shuffle = (array) => {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
      }

      return array;
  }
  componentWillUnmount() {

     this.cancelTokenSource && this.cancelTokenSource.cancel()
  }
  render(){

    const ChoosenAd = () => {
        let AdTypes = ["Banner", "Article"]
        let sizes = ["large", "small", "rectangle"]
        let ChoosenAd = this.shuffle(AdTypes)
        let ChoosenSize = this.shuffle(sizes)
        if(ChoosenAd[0] == "Banner"){
            return <BannerAd size={ChoosenSize[0]} AdPosition="Content(Tin đề xuất)"/>
        }else if (ChoosenAd[0] == "Article") {
            return <ArticleAd/>
        }


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
                        <View>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => {
                                    this.props.navigation.push("Article", {
                                      Article: item,
                                      currentCount: this.props.currentCount,

                                    })
                                    this.props.ShowPopUpAd()
                                  }}
                            >

                                  {(item.format === 'video') ?
                                          <View style={{flex: 1, flexDirection: "column", justifyContent: 'center', marginTop: 10, marginBottom: 10}}>
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
                                                             <BaomoiText style={{color: '#696969', fontSize: 15}}>{item.taxonomy_source[0].name} - {moment(item.modified).fromNow().replace("trước", "").replace("một", "1")}</BaomoiText>
                                                          :
                                                              <BaomoiText style={{color: '#696969', fontSize: 15}}>{moment(item.modified).fromNow().replace("trước", "").replace("một", "1")}</BaomoiText>
                                                        }
                                                        <Comment item={item}/>
                                                    </View>
                                                        <BaomoiText style={{ fontSize: 18*fontSizeRatio,color:textColor, fontWeight: '400'}}>{item.title.plaintitle}</BaomoiText>
                                              </View>
                                          </View> :

                                          <View style={{flex: 1, flexDirection: "row", alignItems:'center', marginTop: 10, marginBottom: 10}}>
                                              <View style={{flex: 2}}>
                                                  <View style={{flexDirection: "row", alignItems:'center'}}>
                                                      {
                                                        (item.taxonomy_source[0])?
                                                           <BaomoiText style={{color: '#696969', fontSize: 15}}>{item.taxonomy_source[0].name} - {moment(item.modified).fromNow().replace("trước", "").replace("một", "1")}</BaomoiText>
                                                        :
                                                            <BaomoiText style={{color: '#696969', fontSize: 15}}>{moment(item.modified).fromNow().replace("trước", "").replace("một", "1")}</BaomoiText>
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

                                    <Divider style={{ backgroundColor: '#e0e0e0'}} />

                            </TouchableOpacity>
                            {(index == 1 || index == 7 ) &&
                                <ChoosenAd/>
                            }
                        </View>
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
