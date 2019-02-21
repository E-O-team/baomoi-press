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
    TextInput
} from 'react-native';
import {Avatar} from 'react-native-elements';
import HTMLView from 'react-native-htmlview';
import axios from 'axios';
import moment from 'moment/min/moment-with-locales'
moment.locale('vi');
export default class CommentList extends React.Component{
  constructor(props){
      super(props);

  }

  render(){
    return(
        <View>


            {
            (this.props.comments.length != 0) ?
              <View>
                <BaomoiText style={{fontSize : 25, marginTop: 20, color: this.props.ui.textColor}}>Bình luận mới nhất</BaomoiText>
                 <FlatList
                      style={styles.root}
                      data={this.props.comments}
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
                                <BaomoiText  style={{fontSize:16*this.props.ui.fontSizeRatio,
                                              fontWeight:"bold",
                                              color:this.props.ui.textColor}}>{Notification.author_name} </BaomoiText>
                                <BaomoiText style={[styles.time,{fontSize:11*this.props.ui.fontSizeRatio}]}>
                                  {moment(Notification.date).fromNow()}
                                </BaomoiText>
                              </View>
                              <HTMLView value={Notification.content.rendered} stylesheet={{p:{color:this.props.ui.textColor, fontSize: 15* this.props.ui.fontSizeRatio}}}/>
                            </View>
                          </View>
                        );
                      }}
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
    marginBottom: 6,
    alignItems: 'center'
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
    color:"#808080",
    marginLeft: 5,
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
