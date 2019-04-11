import React from 'react';
import { BaomoiText } from './StyledText';
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    TextInput,
    Dimensions
} from 'react-native';
import {Avatar} from 'react-native-elements';
import HTMLView from 'react-native-htmlview';
import axios from 'axios';
import moment from 'moment/min/moment-with-locales'
moment.locale('vi');
import HTML from 'react-native-render-html';
export default class CommentList extends React.Component{
  constructor(props){
      super(props);
      this.state = {comments: [], isLoadingComments: false}
  }
  componentWillMount(){
  }
  FetchAsync = async () => {
      const results = this.state.comments.map(async (obj) => this.fetchFBAvatar(obj));
     Promise.all(results).then((completed) => this.setState({comments: completed}));

  }
  fetchFBAvatar = (obj) => {
    if(obj.author == 0) {return obj}
    else{

    return  axios({
                  method: "GET",
                  url: "https://baomoi.press/wp-json/wp/v2/users/" + obj.author,
                  headers: {'Authorization': 'Bearer ' + this.props.user.token},
              }).then(res => {
                if(res.data.custom_avatar.length != 0) {
                  obj.author_avatar_urls['96'] = res.data.custom_avatar
                }
                return obj
              }).catch(err => {return obj})
    }
  }
  renderComment = (item) => {
    if(item.parent == 0) return this.renderThreadedComments(item)
    else return null
  }

  renderThreadedComments = (item) => {
    const childs = this.state.comments.filter(obj => obj.parent == item.id)
        return(
          <View>
              {this.commentView(item)}
              {(childs.length > 0) ?
                <FlatList
                   style={styles.child}
                   data={childs}
                   ItemSeparatorComponent={() => {
                     return (
                       <View style={styles.separator}/>
                     )
                   }}
                   keyExtractor={(item, index) => index.toString()}
                   renderItem={(obj) => this.renderThreadedComments(obj.item)}
                 /> : <View></View>}
          </View>
        );


  }
  commentView = (item) => {
    return (
            <View style={styles.container}>
              <TouchableOpacity onPress={() => {}}>
                <Image
                  source={{uri: item.author_avatar_urls['96']}}
                  style={styles.image}
                />
              </TouchableOpacity>
              <View style={styles.content}>

                  <HTML


                    html={item.content.rendered + '<info>'+ item.author_name + ' - '+ moment(item.date).fromNow().replace("trước", "").replace("một", "1") + '</info>'}
                    imagesMaxWidth={Dimensions.get('window').width-20}
                    onLinkPress={(event, href)=>{
                      Linking.openURL(href)
                    }}
                    ignoredStyles={['width', 'height', 'max-width']}
                    tagsStyles={{info:{fontSize: 12*this.props.ui.fontSizeRatio, color:'#808080'}, p: {margin: 0}}}
                    baseFontStyle={{fontSize: 18*this.props.ui.fontSizeRatio, fontFamily: 'baomoi-regular', color: this.props.ui.textColor}}/>

                    <TouchableOpacity style={{marginTop:5 }} onPress={() => {}}>
                      <Text style={{color: '#808080', fontSize: 14}}>Trả lời</Text>
                    </TouchableOpacity>

              </View>
            </View>

      );
  }



  render(){
    if(this.state.comments.length !== this.props.comments.length )
      {
        this.setState({ comments: this.props.comments, isLoadedAvatar: false})
      }
    if(this.props.user && !this.state.isLoadedAvatar)
      {
        this.setState({isLoadedAvatar: true})
        this.FetchAsync()
      }
    return(
        <View>


            {
            (this.state.comments.length != 0) ?
              <View style={{padding: 10}}>
                <BaomoiText style={{fontSize : 18, marginTop: 20, color: '#003333'}}>Bình luận mới nhất</BaomoiText>
                 <FlatList
                      style={styles.root}
                      data={this.state.comments}
                      ItemSeparatorComponent={() => {
                        return (
                          <View style={styles.separator}/>
                        )
                      }}
                      keyExtractor={(item, index) => index.toString()}
                      initialNumToRender={5}
                      renderItem={(item) =>
                      this.renderComment(item.item)}
                    />
                  </View> : <View></View>
                      }
        </View>

    )
  }
}

const styles = StyleSheet.create({
  root: {
    marginTop:10,
  },
  child:{
    marginTop:10,
    marginLeft: 20
  },
  container: {
    paddingLeft: 19,
    paddingRight: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  content: {
    marginLeft: 10,
    flex: 1,
    alignItems:'flex-start'
  },
  contentHeader: {

    marginBottom: 6,
    justifyContent:'center'
  },
  separator: {
    height: 1,
    backgroundColor: "#CCCCCC"
  },
  image:{
    width:30,
    height:30,
    borderRadius:5,
    marginLeft:5
  },
  time:{
    color:"#808080",
    marginLeft: 10,
  },
  name:{
    fontSize:16,
    fontWeight:"bold",
  },
  dot:{
    width:1,
    height:1,
    backgroundColor: '#696969',
    marginLeft: 5,
  }
});
