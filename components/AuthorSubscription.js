import React from 'react';
import {Text, View, StyleSheet, AsyncStorage, Image} from 'react-native';
import { BaomoiText } from './StyledText';
import {Icon} from 'react-native-elements';
import axios from 'axios';
import {Consumer} from '../context/context.js'
const defaultImg ='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png';


export default class AuthorSubscription extends React.PureComponent{
  constructor(props) {
    super(props)
    this.state={
      source : {},
      isSubscribed: false,
      logo: '',
    }
  }
  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.user !== prevProps.user) {
      this.checkSubscription();
    }
  }

  componentWillMount(){
    this.setState({source : this.props.taxonomy_source})
    this.cancelTokenSource = axios.CancelToken.source()


    axios.get("https://baomoi.press/wp-json/wp/v2/get_source_logo",{
        cancelToken: this.cancelTokenSource.token
    })
    .then(res => res.data)
    .then(json => {
      if(json.length != 0){
        var source_array = json.filter(e => e.title.toUpperCase() === this.state.source.name.toUpperCase())
          if(source_array.length != 0) this.setState({logo : source_array[0].img})

      }
    })
    // .then(json => console.log(json))
    .catch(err => console.log(err))



  }
  isSubscribed = () =>{
    this.setState({isSubscribed: true})
  }

  onSubscribe = async () => {

    var bodyFormData = new FormData();
    bodyFormData.append('source', this.state.source.term_id.toString());
    await axios({
        method: 'post',
        url: 'https://baomoi.press/wp-json/wp/v2/update_user_subscription',
        data: bodyFormData,
        headers: {'Authorization': 'Bearer ' + this.props.user.token},
      },{
          cancelToken: this.cancelTokenSource.token
      }).then(res => {
      if(!this.props.user.subscribed) this.props.user.subscribed = []
      this.props.user.subscribed.push(this.state.source.term_id.toString())
      AsyncStorage.setItem('user', JSON.stringify(this.props.user))

    }).catch(err => console.log(err))
    await this.props.updateUser()

  }


  onUnSubscribe = async () => {
    var bodyFormData = new FormData();
    bodyFormData.append('source', this.state.source.term_id.toString());
    await axios({
        method: 'post',
        url: 'https://baomoi.press/wp-json/wp/v2/delete_user_subscription',
        data: bodyFormData,
        headers: {'Authorization': 'Bearer ' + this.props.user.token},
      },{
          cancelToken: this.cancelTokenSource.token
      }).then(res => {
      this.props.user.subscribed = this.props.user.subscribed.filter(item => item !== this.state.source.term_id.toString())
      AsyncStorage.setItem('user', JSON.stringify(this.props.user))
    }).catch(err => console.log(err))
    await this.props.updateUser()
    this.setState({ isSubscribed: false})

  }
  checkSubscription = () => {
    this.props.user.subscribed && Object.values(this.props.user.subscribed).map( source => {
      if(source === this.state.source.term_id.toString()) this.isSubscribed()
    })
  }
  componentWillUnmount() {

     this.cancelTokenSource && this.cancelTokenSource.cancel()
  }
  render(){


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
          source={{uri: this.state.logo || defaultImg}}
          resizeMode='contain'
          style={{width: 24, height: 24, borderRadius: 24/2}}
          />
        </View>
        {
          (this.props.onHeader) ? <BaomoiText style={[styles.text,{color: '#006666'}]}>{this.state.source.name}</BaomoiText>
          : <BaomoiText style={[styles.text,{color: '#C0C0C0'}]}>{this.state.source.name} - {this.props.moment}</BaomoiText>
        }

        {icon}

      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex : 1
  },
  text: {
    flex: 1,
    textAlign: 'left',
    fontSize: 17,
    marginLeft: 5,
  },
  IconView:{
    width: 28,
    height: 28,
    alignItems: 'center',
    borderRadius: 2,
    justifyContent:'center',
    borderColor: 'red',
    borderWidth: 1,
  },
})
