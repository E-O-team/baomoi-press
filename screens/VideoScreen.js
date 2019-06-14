import React from 'react';
import {Text, View, FlatList, ActivityIndicator, ScrollView} from 'react-native';
import axios from 'axios';
import Articles from '../components/Articles/Articles';
import Header from '../components/Header.js';
import {Consumer} from '../context/context.js';
import BannerAd from '../components/Ads/BannerAd';


export default class VideoListScreen extends React.Component{
  constructor(props){
    super(props)
    this.state={
        articles: [],
        page: 1,
        refreshing: true,
        y: 0,
        isScrollDown: false,

    }
  }
  // static navigationOptions = ({navigation}) => {
  //     return {
  //         title: "Video",
  //         header: <Header navigation={navigation}/>
  //     }
  // }
  componentWillMount() {
      this.fetchVideos()
  }
  fetchVideos = () => {
      console.log(this.state.page)
      this.cancelTokenSource = axios.CancelToken.source()
      axios.get("https://baomoi.press/wp-json/wp/v2/posts?filter[post_format]=post-format-video&per_page=5&page=" + this.state.page, {
          cancelToken: this.cancelTokenSource.token
      })
      .then(res => this.setState({
          articles: [...this.state.articles,...res.data],
          refreshing: false,
      }))
      .catch(err => {
          if(axios.isCancel(err)){
              return
          }else{
              console.log(err)
          }
      })
  }

  componentWillUnmount() {
      this.cancelTokenSource && this.cancelTokenSource.cancel()
  }

  handleRefresh = () => {
      this.setState({
              refreshing: true,
              page: 1,
              articles: []
          },
          () => this.fetchVideos()
      );
  }

  handleLoadMore = () => {
      console.log("loading more");
      this.setState({
          page: this.state.page + 1,
      }, () => this.fetchVideos())
  }

  handleOnScroll = (e) => {
    this.setState({y: e.nativeEvent.contentOffset.y})
      if(this.state.y != 0){
         if(this.state.y > e.nativeEvent.contentOffset.y && this.state.isScrollDown) {
           this.props.navigation.setParams({ visible: true })
           this.setState({isScrollDown : false})
         }
         if(this.state.y < e.nativeEvent.contentOffset.y && !this.state.isScrollDown) {

           this.props.navigation.setParams({ visible: false })
           this.setState({isScrollDown : true})
         }


     }
  }

    render(){
    return(

            <Consumer>
                {({textColor, backGround}) => (
                    <View style={{flex: 1, backgroundColor: backGround}}>
                        <FlatList
                        onScroll={this.handleOnScroll}
                        data={this.state.articles}
                        extraData={this.state.articles}
                        renderItem={({ item, index }) => <Articles item={item} navigation={this.props.navigation} ui={{textColor, backGround}} index={index}/>}
                        keyExtractor={item => item.id.toString()}
                        removeClippedSubviews={true}
                        windowSize={18}
                        refreshing={this.state.refreshing}
                        onRefresh={this.handleRefresh}
                        onEndReached={() => this.handleLoadMore()}
                        onEndReachedThreshold={0.5}
                        />
                    </View>
                )}
            </Consumer>
    )
    }
}
