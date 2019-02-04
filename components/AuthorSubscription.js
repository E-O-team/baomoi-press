import React from 'react';
import {Text, View, StyleSheet, AsyncStorage, Image} from 'react-native';
import { BaomoiText } from './StyledText';
import {Icon} from 'react-native-elements';
import axios from 'axios';

export default class AuthorSubscription extends React.Component{
  constructor(props) {
    super(props)
    this.state={
      source : {},
      isSubscribed: false,
    }
  }
  componentWillMount(){
    this.setState({source : this.props.taxonomy_source})
  }
  onSubscribe = async () => {
    this.setState({isSubscribed: true})
    var bodyFormData = new FormData();
    bodyFormData.append('source', this.state.source.term_id.toString());
    axios({
        method: 'post',
        url: 'https://baomoi.press/wp-json/wp/v2/update_user_subscription',
        data: bodyFormData,
        headers: {'Authorization': 'Bearer ' + this.props.user.token},
    }).then(res => {
      if(!this.props.user.subscribed) this.props.user.subscribed = []
      this.props.user.subscribed.push(this.state.source.term_id.toString())
       AsyncStorage.setItem('user', JSON.stringify(this.props.user))
    }).catch(err => console.log(err))

  }


  onUnSubscribe = async () => {
    var bodyFormData = new FormData();
    bodyFormData.append('source', this.state.source.term_id.toString());
    axios({
        method: 'post',
        url: 'https://baomoi.press/wp-json/wp/v2/delete_user_subscription',
        data: bodyFormData,
        headers: {'Authorization': 'Bearer ' + this.props.user.token},
    }).then(res => {
      this.props.user.subscribed = this.props.user.subscribed.filter(item => item !== this.state.source.term_id.toString())
      this.setState({isSubscribed: false})
       AsyncStorage.setItem('user', JSON.stringify(this.props.user))
    }).catch(err => console.log(err))

  }
  render(){

     if(this.props.user && !this.state.isSubscribed){
       this.props.user.subscribed && this.props.user.subscribed.map( source => {
         if(source === this.state.source.term_id.toString()) this.setState({isSubscribed : true})
       })
     }
    var icon = (this.state.isSubscribed)?
    <View style={[styles.IconView, {backgroundColor : 'red'}]}>
      <Icon
        name='user-check'
        type='feather'
        color='white'
        size={20}
        onPress={() => this.onUnSubscribe()}
      />

    </View> :
    <View style={styles.IconView}>
      <Icon
        name='user-plus'
        type='feather'
        color='red'
        size={20}
        onPress={() => this.onSubscribe()}
      />
    </View>

    return(
      <View style={styles.container}>
        <View style={{height: 30 , width: 30, borderRadius: 30/2, borderColor: '#696969', borderWidth: 1, alignItems:'center', justifyContent:'center'}}>
          <Image
          source={{uri: "https://" + this.state.source.name + "/favicon.ico"}}
          style={{ height: 30 , width: 30, borderRadius: 30/2, resizeMode:'contain'}}
          />
        </View>
        <BaomoiText style={styles.text}>{this.state.source.name}</BaomoiText>
        {icon}

      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center'
  },
  text: {
    flex: 1,
    textAlign: 'left',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  IconView:{
    marginRight: 20,
    width: 30,
    height: 30,
    alignItems: 'center',
    borderRadius: 10,
    borderColor: 'red',
    borderWidth: 1,
  },
})