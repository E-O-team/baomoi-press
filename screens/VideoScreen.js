import React from 'react';
import {Text, View, FlatList, ActivityIndicator} from 'react-native';
import axios from 'axios';
import Articles from '../components/Articles';
export default class VideoScreen extends React.Component{
  constructor(props){
    super(props)
    this.state={
        articles: [],
        page: 1,
        refreshing: true,

    }
  }
  static navigationOptions = {
    title: 'Video',
  };
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

  render(){
    return(
      <View>
          <FlatList
              data={this.state.articles}
              renderItem={({ item }) => <Articles item={item} navigation={this.props.navigation}/>}
              keyExtractor={item => item.id.toString()}
              refreshing={this.state.refreshing}
              ListFooterComponent={() => <ActivityIndicator size="large" animating />}
              onRefresh={this.handleRefresh}
              onEndReached={() => this.handleLoadMore()}
              onEndReachedThreshold={0.7}
          />
      </View>
    )
  }
}
