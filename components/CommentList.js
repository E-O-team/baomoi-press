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
              <View style={{padding: 10}}>
                <BaomoiText style={{fontSize : 18, marginTop: 20, color: '#003333'}}>Bình luận mới nhất</BaomoiText>
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
                              <Image
                                source={{uri: Notification.author_avatar_urls['96']}}
                                style={styles.image}
                              />
                            </TouchableOpacity>
                            <View style={styles.content}>

                                <Text>
                                <BaomoiText style={{color:this.props.ui.textColor, fontSize: 18* this.props.ui.fontSizeRatio}}>{Notification.content.rendered.replace('<p>','').replace('</p>','').replace('\n','')}</BaomoiText>


                                <BaomoiText  style={{fontSize:10*this.props.ui.fontSizeRatio,
                                                      color:'#808080'}}> - {Notification.author_name} - {moment(Notification.date).fromNow()}</BaomoiText>
                                </Text>
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
    marginLeft: 10,
    flex: 1,
    flexDirection: 'row',
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
