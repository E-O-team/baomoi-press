import React from 'react';
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    TextInput
} from 'react-native';
import {Avatar} from 'react-native-elements';
import HTMLView from 'react-native-htmlview';
import axios from 'axios';
export default class CommentList extends React.Component{
  constructor(props){
      super(props);
      this.state ={
        comments : [],
        text : '',
      }
  }
  componentWillMount(){
    this.fetchCommentList()

  }
  fetchCommentList = () => {
    fetch("https://baomoi.press/wp-json/wp/v2/comments?post="+this.props.article.id)
    .then(res => res.json())
    .then(json => this.setState({
        comments: json,
    }))
    // .then(json => console.log(json))
    .catch(err => console.log(err))
  }
  SubmitComment = () => {

    if(this.state.text.length > 3)
    {
      axios({
          method: 'post',
          url: 'https://baomoi.press/wp-json/wp/v2/comments',
          data: {
            post: this.props.article.id,
            content: this.state.text
          },
          headers: {'Authorization': 'Bearer ' + this.props.user.token},
      })
      .then(res => this.setState({text:''}))
      .catch(err => console.log(err))

      axios({
          method: "GET",
          url: 'https://baomoi.press/wp-json/wp/v2/add_exp?ammount=1',
          headers: {'Authorization': 'Bearer ' + this.props.user.token},
      })
    }
  }
  render(){
    return(
        <View>
            <Text style={{fontSize : 30, textAlign: 'center', marginTop: 20, color: this.props.ui.textColor}}>Comment</Text>
            {
              this.props.user &&
              <View style={{marginTop: 20}}>
                  <View style={{flexDirection: 'row'}}>
                    <Avatar
                      size="small"
                      source={{uri: this.props.user.avatar_urls['96']}}
                      activeOpacity={0.7}
                    />
                    <Text style={{marginLeft: 5}}>{this.props.user.name}</Text>
                  </View>
                  <View style={{borderColor:'#CCCCCC', borderWidth: 1, borderRadius: 5, marginTop: 10}}>
                    <TextInput
                    style={{height:60, alignItems:'center'}}
                    onChangeText={(text) => this.setState({text: text})}
                    value={this.state.text}
                    multiline={true}
                    placeholder='Write a comment...'
                    />
                  </View>
                  <View style={{alignItems: 'center'}}>
                    <TouchableOpacity style={{width:50, height: 20, backgroundColor:'#0080FF', borderRadius: 10, marginTop: 10, alignItems:'center'}}
                      onPress={() => this.SubmitComment()}>
                      <Text style={{color: 'white'}}>Post</Text>
                    </TouchableOpacity>
                  </View>
              </View>
            }

            {
                this.state.comments &&
                 <FlatList
                      style={styles.root}
                      data={this.state.comments}
                      extraData={this.state}
                      ItemSeparatorComponent={() => {
                        return (
                          <View style={styles.separator}/>
                        )
                      }}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={(item) => {
                        const Notification = item.item;
                        return(
                          <View style={styles.container}>
                            <TouchableOpacity onPress={() => {}}>
                              <Avatar
                                size="small"
                                source={{uri: Notification.author_avatar_urls['96']}}
                                onPress={() => console.log(image)}
                                activeOpacity={0.7}
                              />
                            </TouchableOpacity>
                            <View style={styles.content}>
                              <View style={styles.contentHeader}>
                                <Text  style={{fontSize:16,
                                              fontWeight:"bold",
                                              color:this.props.ui.textColor}}>{Notification.author_name}</Text>
                                <Text style={styles.time}>
                                  {Notification.date}
                                </Text>
                              </View>
                              <HTMLView value={Notification.content.rendered} stylesheet={{p:{color:this.props.ui.textColor}}}/>
                            </View>
                          </View>
                        );
                      }}
                    />
                      }
        </View>

    )
  }
}

const styles = StyleSheet.create({
  root: {
    marginTop:10,
  },
  container: {
    paddingLeft: 19,
    paddingRight: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  content: {
    marginLeft: 16,
    flex: 1,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  separator: {
    height: 1,
    backgroundColor: "#CCCCCC"
  },
  image:{
    width:45,
    height:45,
    borderRadius:20,
    marginLeft:20
  },
  time:{
    fontSize:11,
    color:"#808080",
  },
  name:{
    fontSize:16,
    fontWeight:"bold",
  },
});
