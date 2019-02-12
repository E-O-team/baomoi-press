import React from 'react';
import { Text, View,Keyboard,TextInput, Dimensions, WebView, StyleSheet, TouchableOpacity, TouchableHighlight, Platform,Image,Modal } from 'react-native';
import { BaomoiText } from '../components/StyledText';
import {Icon} from 'react-native-elements';
import axios from 'axios';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default class CommentModal extends React.Component{
  constructor(){
    super()
    this.state = {
      modalVisible: false,
      registerVisible: false,
      text: '',
      keyboardHeight: 0,
    }
  }
  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow.bind(this),
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide.bind(this),
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow(e) {
    this.setState({ keyboardHeight: e.endCoordinates.height })
  }

  _keyboardDidHide() {

  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  submitComment = () => {
    if(this.props.user)
      {

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
                .then(res => {
                  this.fetchCommentList()
                  this.setState({text: '', modalVisible: false})
                })
                .catch(err => console.log(err))

                axios({
                    method: "GET",
                    url: 'https://baomoi.press/wp-json/wp/v2/add_exp?ammount=1',
                    headers: {'Authorization': 'Bearer ' + this.props.user.token},
                })

            }

     } else {
            this.setState({ modalVisible: false, registerVisible: true})
     }

  }

  render(){

    return (
      <View >
          <View style={styles.BottomView}>
            <View style={{flex: 1}}>
              <Icon
                name='pencil'
                type='evilicon'
                size={30}
                color='#696969'
                />
            </View>
            <View style={{flex : 3}}>
              <TouchableOpacity style={styles.commentButton} onPress={() => this.setModalVisible(true)}>
                <Text style={{color: '#696969', fontSize: 10}}>Viết bình luận ...</Text>
              </TouchableOpacity>
            </View>

          </View>

          <Modal
             transparent={true}
             visible={this.state.modalVisible}
             >
            <View>
                 <TouchableOpacity style={{
                   backgroundColor:'black',
                   opacity: 0.7,
                   height: screenHeight - 40 - this.state.keyboardHeight}}
                   onPress={() => this.setModalVisible(!this.state.modalVisible)}>

                 </TouchableOpacity>
                 <View style={{
                     height: 40,
                     backgroundColor: 'white',
                     justifyContent:'center',
                   }}>
                   <View style={{flexDirection: 'row', alignItems: 'center'}}>

                      <TextInput
                        style={{flex: 3, alignItems:'center'}}
                        onChangeText={(text) => this.setState({text: text})}
                        autoFocus={true}
                        value={this.state.text}
                        multiline={true}
                        placeholder='Write a comment...'
                      />
                      <View style={{flex: 1}}>
                         <TouchableHighlight
                          style={{marginLeft: 20, width: 50, height:30, borderRadius:10, backgroundColor: '#0080FF', alignItems:'center', justifyContent:'center'}}
                           onPress={() => {
                             this.submitComment()
                           }}>
                           <BaomoiText style={{color: 'white'}}>Send</BaomoiText>
                          </TouchableHighlight>
                      </View>
                   </View>
                 </View>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.registerVisible}>
             <View style={{backgroundColor: 'black',
                           height: screenHeight /4,
                           marginTop: screenHeight*3/4,
                           padding: 20}}>

                <View style={{flexDirection: 'row'}}>
                  <BaomoiText style={{color: 'white', flex : 3, fontSize: 20}}> Sign In to Comment</BaomoiText>
                  <View style={{flex: 1,  alignItems: 'flex-end'}}>
                    <TouchableOpacity onPress={() => this.setState({registerVisible: false})}>
                      <Icon
                      name='clear'
                      size={30}
                      color='#fff'
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity style={{marginTop: 20,
                                          height: 30,
                                          backgroundColor: '#E23636',
                                          borderRadius: 5,
                                          justifyContent:'center',
                                          alignItems:'center'
                                        }}
                                        onPress={() => {
                                          this.props.navigation.navigate('SignIn')
                                          this.setState({registerVisible: false})
                                        }}>
                    <Text style={{color:'white', fontWeight: 'bold', fontSize: 15}}>SIGN IN</Text>

                </TouchableOpacity>

             </View>
          </Modal>
      </View>

    )

  }
}




const styles = StyleSheet.create({
  BottomView:{
    height: 40,
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: '#696969',
    justifyContent:'center',
    borderWidth: 0.5
  },
  commentButton:{
    borderColor:'#CCCCCC',
    borderWidth: 2,
    borderRadius: 5,
    marginRight : 10,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
});
