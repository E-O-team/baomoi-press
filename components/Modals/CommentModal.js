import React from 'react';
import { Text, View,Keyboard,TextInput, Dimensions, WebView, StyleSheet, TouchableOpacity, TouchableHighlight, Platform,Image,Modal, Alert} from 'react-native';
import { BaomoiText } from '../StyledText';
import SignInModal from './SignInModal'
import {Icon} from 'react-native-elements';
import axios from 'axios';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default class CommentModal extends React.PureComponent{
  constructor(){
    super()
    this.state = {
      signInVisible : false,
      text: '',
      keyboardHeight: 0,
    }
  }
  componentDidMount() {
    this.cancelTokenSource = axios.CancelToken.source()
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
    this.cancelTokenSource && this.cancelTokenSource.cancel()
  }

  _keyboardDidShow(e) {
    this.setState({ keyboardHeight: e.endCoordinates.height })
  }

  _keyboardDidHide() {

  }

  setSignInModalVisible = (visible) => {
    this.setState({signInVisible : visible})
  }

  setSignInLoading = (isLoading) => {
    //don't need to do now
  }

  updateUser = () => {
      this.props.updateUser()
      this.props.navigation.setParams({ shouldUpdateSideBar : true})
  }

  submitComment = () => {
    if(this.props.user)
      {

            if(this.state.text.length > 3)
            {

                this.setState({text: ''}, () => this.props.setModalVisible(false, 0))

                axios({
                    method: 'POST',
                    url: 'https://baomoi.press/wp-json/wp/v2/comments',
                    data: {
                      post: this.props.article.id,
                      content: this.state.text,
                      parent : this.props.commentParent
                    },
                    headers: {'Authorization': 'Bearer ' + this.props.user.token},
                },{
                    cancelToken: this.cancelTokenSource.token
                })
                .then(res => {
                    this._showAlert('Thành công', 'Bình luận của bạn đang được kiểm duyệt')
                    this.props.onFetch()
                })
                .catch(err => console.log(err))

                axios({
                    method: "GET",
                    url: 'https://baomoi.press/wp-json/wp/v2/add_exp?ammount=1&action_type=comments&id=' + this.props.user.id.toString(),
                },{
                    cancelToken: this.cancelTokenSource.token
                })

            }

     } else {
            this.props.setModalVisible(false, 0)
            this.setState({signInVisible: true})
     }

  }

  _showAlert = (title, msg) => {
   Alert.alert(
      title,
      msg,
      [
        {text: 'OK', onPress: () => {}},
        { onDismiss: () => {} }
      ],
      { cancelable: false }
   )
 }

  render(){

    return (
      <View >
          <View style={styles.BottomView}>
            <View style={{flex: 1, alignItems: 'center'}}>
              {
                (this.props.user != undefined) ?
                <Image
                style={{width: 30, height: 30, borderRadius: 2, borderWidth:1, borderColor: '#99CCFF'}}
                source={{uri : this.props.user.custom_avatar || this.props.user.avatar_urls['96']}}
                /> :
                <Icon
                  name='pencil'
                  type='evilicon'
                  size={30}
                  color='#696969'
                  />
              }

            </View>
            <View style={{flex : 3}}>
              <TouchableOpacity style={styles.commentButton} onPress={() =>  this.props.setModalVisible(true, 0)}>
                <Text style={{color: '#C0C0C0', fontSize: 14}}>Nhập bình luận ...</Text>
              </TouchableOpacity>
            </View>
            <View style={{flex : 1, alignItems:'flex-start'}}>
                <View style={{marginRight: 10}}>
                    <Icon
                      name='comment'
                      type='evilicon'
                      size={35}
                      color='#696969'
                      onPress={() => this.props.scrollView.scrollToEnd()}

                      />
                </View>
                <View style={{width: 20, height: 20, backgroundColor:'red', borderRadius: 20/2, justifyContent:'center', left: 15,
                               position:'absolute'}}>
                  <Text style={{color: 'white', textAlign:'center', fontSize: 8, fontWeight:'bold'}}>{this.props.commentLength}</Text>
                </View>
            </View>

          </View>

          <Modal
             transparent={true}
             visible={this.props.modalVisible}
             onRequestClose={() => this.props.setModalVisible(false, 0)}
             >
            <View>
                 <TouchableOpacity style={{
                   backgroundColor:'black',
                   opacity: 0.7,
                   height: screenHeight - this.state.keyboardHeight- (Platform.OS == "ios" ? 150 : 170)}}
                   onPress={() => this.props.setModalVisible(false, 0)}>

                 </TouchableOpacity>
                 <View style={{
                     height: 150,
                     backgroundColor: 'white',
                     justifyContent:'center',
                     padding: 10,
                   }}>

                    <View style={{flex: 3}}>
                      <TextInput
                        style={{height: 80, backgroundColor:'#C0C0C0', borderRadius: 5, padding: 5}}
                        onChangeText={(text) => this.setState({text: text})}
                        autoFocus={true}
                        value={this.state.text}
                        textAlignVertical={'top'}
                        multiline={true}
                        placeholder='Lời bình luận hay được ưu tiên hiển thị'
                        placeholderTextColor='#606060'
                      />
                    </View>

                    <View style={{flex: 1, flexDirection: 'row', alignItems:'center', marginBottom: 5}}>
                      <View style={{flex : 3, alignItems:'flex-start', justifyContent:'center'}}>
                        <Text style={{color: '#606060', fontSize: 12}}>Bình luận không nói tục, chửi bậy</Text>
                      </View>
                      <View style={{flex : 1, alignItems:'center'}}>
                       <TouchableHighlight
                        style={{marginLeft: 20, width: 70, height:30, borderRadius:5, backgroundColor: 'red',
                                alignItems:'center', justifyContent:'center',marginRight: 10}}
                         onPress={() => {
                           this.submitComment()
                         }}>
                            <BaomoiText style={{color: 'white', fontSize:10, fontWeight:'bold'}}>PHÁT BIỂU</BaomoiText>
                        </TouchableHighlight>
                      </View>
                    </View>

                 </View>
            </View>
          </Modal>

          <SignInModal visible={this.state.signInVisible} setModalVisible={this.setSignInModalVisible} navigation={this.props.navigation} setLoading={this.setSignInLoading} updateUser={this.updateUser}/>

      </View>

    )

  }
}




const styles = StyleSheet.create({
  BottomView:{
    height: 40,
    alignItems: 'center',
    flexDirection: 'row',
    borderTopColor: '#e0e0e0',
    justifyContent:'center',
    borderTopWidth: 0.5
  },
  commentButton:{
    marginLeft: 10,
    height: 30,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
});
