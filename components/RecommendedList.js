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
import RecommendedArticle from './RecommendedArticle'
import axios from 'axios';


import moment from 'moment/min/moment-with-locales'
const defaultImg ='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png';

const screenWidth = Dimensions.get('window').width;
const videoHeightRatio = 9/16;
moment.locale('vi');

export default class RecommendedList extends React.PureComponent{
  constructor(props){
    super(props);
    this.state = {
      Articles : [],
    }
  }
  componentDidMount(){
    this.cancelTokenSource = axios.CancelToken.source()
    if(this.props.article.format === 'video') this.fetchVideos()
    else this.fetchArticles()


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

  fetchArticles = async() => {
    var Articles = []
    if(this.props.article.tags.length != 0)
    {

    var tag_length = this.props.article.tags.length;
    var first_tag = Math.floor(Math.random() * tag_length);


    await axios.get("https://baomoi.press/wp-json/wp/v2/posts?tags="+ this.props.article.tags[first_tag].toString(),{
                            cancelToken: this.cancelTokenSource.token
                        })
    .then(res => res.data)
    .then(json => {
      if(json.length > 1)
      {
          const first_article = json[Math.floor(Math.random() * json.length)]
          if(first_article.id !== this.props.article.id)
          Articles.push(first_article)
      }
    })
    .catch(err => console.log(err))



    var second_tag = Math.floor(Math.random() * tag_length);

    while(second_tag == first_tag && tag_length != 1) second_tag = Math.floor(Math.random() * tag_length)
    if(tag_length > 1)
    await axios.get("https://baomoi.press/wp-json/wp/v2/posts?tags="+ this.props.article.tags[second_tag].toString(),{
                              cancelToken: this.cancelTokenSource.token
                          })
      .then(res => res.data)
      .then(json => {
        if(json.length > 1){
            const second_article = json[Math.floor(Math.random() * json.length)]
            if(second_article.id !== this.props.article.id)
            Articles.push(second_article)
        }
     })
      .catch(err => console.log(err))


  }

    var prev_day = Moment().subtract(1, "days").toISOString();

    await axios.get("https://baomoi.press/wp-json/wp/v2/posts?per_page=30&orderby=date&order=asc&after="+ prev_day,{
        cancelToken: this.cancelTokenSource.token
    })
    .then(res => res.data)
    .then(json => {


         while(Articles.length < 10){

            var is_duplicated = false;
            var new_article = json[Math.floor(Math.random() * json.length)]
            Articles.forEach((article) => {
                if(article){
                      if(article.id === new_article.id || this.props.article.id === new_article.id) is_duplicated = true
                  }
            })
            if(!is_duplicated){
               Articles.push(new_article)
            }
          }


    })
    this.setState({Articles : Articles})


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

  renderItem = ({item, index}) => {
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
          <View>
            <RecommendedArticle item={item} navigation={this.props.navigation}/>
            {(index == 1 || index == 7 ) &&
                <View>
                    <ChoosenAd/>
                    <Divider style={{ backgroundColor: '#e0e0e0'}} />
                </View>
            }
          </View>
      )


  }

  render(){




    return(
      <View style={{padding: 10}}>
        <Consumer>
          {({textColor, backGround, fontSizeRatio}) => (
            <View>
              <BaomoiText style={{fontSize: 16* this.props.ui.fontSizeRatio,color:'#003333', marginBottom: 15, fontWeight:'500'}}>TIN KHÁC</BaomoiText>
                  <FlatList
                    data={this.state.Articles}
                    extraData={this.state}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => item.id.toString()}
                />
              </View>
              )}
            </Consumer>
        </View>


  )
  }


}
