import React from 'react';
import {Text, View, StyleSheet, AsyncStorage} from 'react-native';
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
      console.log(res)
      this.props.user.subscribed.push(this.state.source.term_id.toString())
       AsyncStorage.setItem('user', JSON.stringify(this.props.user))
    }).catch(err => console.log(err))

  }
  render(){
    if(this.props.user && !this.state.isSubscribed){
      this.props.user.subscribed.map( source => {
        if(source === this.state.source.term_id.toString()) this.setState({isSubscribed : true})
      })
    }
    var icon = (this.state.isSubscribed)?
    <View style={styles.IconViewCheck}>
      <Icon
        name='user-check'
        type='feather'
        color='white'
        size={20}
      />
    </View> :
    <View style={styles.IconViewPlus}>
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
        <Text style={styles.text}>{this.state.source.name}</Text>
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
  },
  text: {
    flex: 1,
    textAlign: 'left',
    fontSize: 18,
    fontWeight: 'bold'
  },
  IconViewPlus:{
    marginRight: 20,
    width: 30,
    height: 30,
    alignItems: 'center',
    borderRadius: 10,
    borderColor: 'red',
    borderWidth: 1,
  },
  IconViewCheck:{
    marginRight: 20,
    width: 30,
    height: 30,
    alignItems: 'center',
    borderRadius: 10,
    borderColor: 'red',
    borderWidth: 1,
    backgroundColor: 'red'
  }
})
