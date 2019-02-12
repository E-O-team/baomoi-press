import React from 'react';
import {Text, View, FlatList, ActivityIndicator} from 'react-native';
import axios from 'axios';
import Articles from '../components/Articles';
import Header from '../components/Header.js';
import {Consumer} from '../context/context.js';


export default class VideoScreen extends React.Component{
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
  static navigationOptions = ({navigation}) => {
      return {
          title: "Video",
          header: <Header navigation={navigation}/>
      }
  }
  componentWillMount() {
      this.fetchVideos()
  }
  fetchVideos = () => {
      axios.get("https://baomoi.press/wp-json/wp/v2/posts?filter[post_format]=post-format-video&per_page=5&page=" + this.state.page)
      .then(res => this.setState({
          articles: [...this.state.articles,...res.data],
          refreshing: false,
      }))
      .catch(err => console.log(err))
  }

  handleLoadMore = () => {
      console.log("loading more");
      this.setState({
          page: this.state.page + 1,
      }, () => this.fetchVideos())
  }

  handleBeginDrag = (e) =>{
    // this.setState({y: e.nativeEvent.contentOffset.y})
    // if(this.state.y != 0){
    //   if(this.state.isScrollDown) this.props.navigation.setParams({ visible: false })
    // }
  }

  handleEndDrag = (e) =>{
    // this.setState({y: e.nativeEvent.contentOffset.y})
    // if(e.nativeEvent.contentOffset.y <= this.state.y)
    // {
    //   this.props.navigation.setParams({ visible: true })
    //   this.setState({isScrollDown : false})
    // }else{
    //   this.setState({isScrollDown: true})
    // }
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
      <View style={{flex: 1}}>
        <Consumer>
          {({textColor, backGround}) => (
          <FlatList
              onScrollBeginDrag={this.handleBeginDrag}
              onScrollEndDrag={this.handleEndDrag}
              onScroll={this.handleOnScroll}
              data={this.state.articles}
              renderItem={({ item }) => <Articles item={item} navigation={this.props.navigation} video={true} ui={{textColor, backGround}}/>}
              keyExtractor={item => item.id.toString()}
              refreshing={this.state.refreshing}
              ListFooterComponent={() => <ActivityIndicator size="large" animating />}
              onRefresh={this.handleRefresh}
              onEndReached={() => this.handleLoadMore()}
              onEndReachedThreshold={0.7}
          />
        )}
        </Consumer>
      </View>
    )
  }
}
