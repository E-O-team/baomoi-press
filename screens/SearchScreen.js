import React from 'react';
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    Button,
    TouchableHighlight,
    TextInput,
    FlatList,
    ActivityIndicator,
    Dimensions,
    Linking,
    ScrollView
} from 'react-native';
import {Icon, SearchBar, Divider} from 'react-native-elements';
import { BaomoiText } from '../components/StyledText';
import {Consumer} from '../context/context.js';
import moment from 'moment/min/moment-with-locales'
const defaultImg ='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png';
import axios from 'axios';
moment.locale('vi')

export default class SearchScreen extends React.Component{
  constructor(props){
    super(props);
    this.state={
      text:'',
      animating: false,
      page: 1,
      results:[],
      trendings: []
    }
  }


  static navigationOptions = ({ navigation }) => {
    const {params = {}} = navigation.state;
    return{
      title: "Search",
      header: (
        <Consumer>
          {({textColor, backGround}) => (
              <View
                style={{
                  flexDirection: "row",
                  height: 50,
                  backgroundColor: backGround,
                }}>
                <TouchableOpacity style={{flex: 1, justifyContent:'center'}} onPress={()=>navigation.goBack()}>
                  <Icon
                    name='chevron-left'
                    size={35}
                    color='#696969'
                  />
                </TouchableOpacity>
                <View style={{flex: 4, justifyContent:'center'}}>
                  <TextInput
                  style={{height:30, color : textColor, borderBottomColor: '#C0C0C0', borderBottomWidth: 0.5}}
                  onChangeText={(text) => params.ChangeText(text)}
                  value={params.text}
                  underlineColorAndroid='transparent'
                  onSubmitEditing={() => params.onSubmit(params.text)}
                  placeholder='Tìm kiếm'
                  />
                </View>
                <View style={{flex: 1, justifyContent:'center'}}>
                  <Icon
                    name='clear'
                    size={22}
                    color='#696969'
                    onPress={()=>params.clear()}
                  />
                </View>
              </View>
            )}
        </Consumer>
      )

    }
  }

  componentDidMount() {
      this.cancelTokenSource = axios.CancelToken.source()
      this.props.navigation.setParams({onSubmit: this.onSubmit, ChangeText: this.ChangeText, text: '', clear:this.clear});
      this.fetchTrendings()


  }

  fetchTrendings = () => {
      axios.get("http://baomoi.press/wp-json/wp/v2/get_trending_hear", {
          cancelToken: this.cancelTokenSource.token
      })
      .then(res => res.data)
      .then(json => this.setState({
          trendings : json
      }))
      .catch(err => console.log(err))
  }

  componentWillUnMount() {
      this.cancelTokenSource && this.cancelTokenSource.cancel()
 }

  ChangeText = (text) =>{
      this.props.navigation.setParams({onSubmit: this.onSubmit, ChangeText: this.ChangeText, text: text, clear:this.clear});
  }

  clear = () => {
      this.props.navigation.setParams({onSubmit: this.onSubmit, ChangeText: this.ChangeText, text: '', clear:this.clear});
  }

  onSubmit = (text) => {
        this.setState({animating: true, page: 1, results: []}, () => this.fetchPosts(text))
  }

  fetchPosts = (text) => {
      const str = text.replace(" ", "-")
      
      axios.get("https://baomoi.press/wp-json/wp/v2/posts?search=" + str +"&per_page=10&page=" + this.state.page, {
          cancelToken: this.cancelTokenSource.token
      })
      .then(res => res.data)
      .then(json => this.setState({
          results: [...this.state.results, ...json],
          animating: false,
      }))
      .catch(err => console.log(err))
  }

  _renderTrendingItems = ({ item, index }) => (
          <Consumer>
            {({textColor}) => (
                <TouchableOpacity   style={styles.trendings} key={index}
                                    onPress={() => Linking.openURL(item.trending_link)}>

                                    <Text style={{color: textColor}}>#{item.title}</Text>

                </TouchableOpacity>
            )}
          </Consumer>
        )

  _renderItem = ({ item , index}) => (
      <Consumer>
        {({textColor, backGround, fontSizeRatio}) => (

              <View style={{ height: 130, backgroundColor: backGround}}>
                  <TouchableWithoutFeedback
                      onPress={() => this.props.navigation.push("Article", {
                          Article: item
                      })}
                      style={{flex: 1}}
                  >
                      <View style={{flex: 1, flexDirection: "row", alignItems:'center'}}>
                          <View style={{flex: 2}}>
                              <View style={{flexDirection: "row", alignItems:'center'}}>
                                  {
                                    (item.taxonomy_source[0])?
                                       <BaomoiText style={{color: '#696969', fontSize: 14}}>{item.taxonomy_source[0].name} - {moment(item.modified).fromNow().replace("trước", "").replace("một", "1")}</BaomoiText>
                                    :
                                        <BaomoiText style={{color: '#696969', fontSize: 14}}>{moment(item.modified).fromNow().replace("trước", "").replace("một", "1")}</BaomoiText>
                                  }
                              </View>
                              <BaomoiText style={{fontSize: 17.3, fontWeight: '500',color: textColor}}>{item.title.plaintitle}</BaomoiText>
                          </View>
                          <Image
                              source={{uri :item.thumb || defaultImg}}
                              style={{height: 90, flex: 1, marginLeft: 5, borderRadius: 5}}
                          />
                      </View>
                  </TouchableWithoutFeedback>
              </View>
        )}
      </Consumer>
  )

  handleLoadMore = () => {
      const {params = {}} = this.props.navigation.state;
      if(params.text) this.setState({page: this.state.page + 1}, () => this.fetchPosts(params.text))
  }

  render(){
    return(
      <Consumer>
        {({textColor, backGround, fontSizeRatio}) => (
            <View style={{flex: 1,  backgroundColor: '#EFEEF6'}}>
                    <View style={{ marginBottom: 10, backgroundColor: backGround}}>
                        <Text style={{margin: 10, color: '#003333'}}>TÌM NHANH</Text>
                        <FlatList
                           horizontal={false}
                           data={this.state.trendings}
                           keyExtractor={(item, index) => index.toString()}
                           renderItem={this._renderTrendingItems}
                           />
                     </View>

                     <ScrollView style={{paddingHorizontal: 20, backgroundColor: backGround}}>
                         {this.state.animating && <ActivityIndicator size="large" />}
                         <FlatList
                               data={this.state.results}
                               renderItem={this._renderItem}
                               keyExtractor={(item, index) => item.id.toString()}
                               initialNumToRender={5}
                               removeClippedSubviews={true}
                               windowSize={15}
                               onEndReached={() => this.handleLoadMore()}
                               onEndReachedThreshold={0.7}
                           />
                     </ScrollView>
              </View>
          )}
        </Consumer>
    )
  }

}

const styles = StyleSheet.create({
     trendings: {
         height: 30,
         justifyContent: 'center',
         alignItems:'center',
         marginHorizontal:10,
         marginBottom: 10,
         borderWidth: 0.5,
         borderColor: '#C0C0C0',
         borderRadius: 5
      },
  })
