import React from 'react';
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Button,
    TouchableHighlight,
    TextInput,
    FlatList,
    ActivityIndicator
} from 'react-native';
import {Icon, SearchBar, Divider} from 'react-native-elements';
import { BaomoiText } from '../components/StyledText';
import {Consumer} from '../context/context.js';
const defaultImg ='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png';


export default class SearchScreen extends React.Component{
  constructor(props){
    super(props);
    this.state={
      text:'',
      animating: false,
      results:[]
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
                  marginTop: Platform.OS == "ios" ? 20 : 20 // only for IOS to give StatusBar Space
                }}>
                <View style={{flex: 1, justifyContent:'center'}}>
                  <Icon
                    name='chevron-left'
                    size={35}
                    color='#696969'
                    onPress={()=>navigation.goBack()}
                  />
                </View>
                <View style={{flex: 4, justifyContent:'center'}}>
                  <TextInput
                  style={{height:50}}
                  onChangeText={(text) => params.ChangeText(text)}
                  value={params.text}
                  underlineColorAndroid='transparent'
                  onSubmitEditing={() => params.onSubmit(params.text)}
                  placeholder='Search Articles'
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
  componentWillMount() {
   this.props.navigation.setParams({onSubmit: this.onSubmit, ChangeText: this.ChangeText, text: '', clear:this.clear});
 }
  ChangeText = (text) =>{
    this.props.navigation.setParams({onSubmit: this.onSubmit, ChangeText: this.ChangeText, text: text, clear:this.clear});
  }
  clear = ()=>{
    this.props.navigation.setParams({onSubmit: this.onSubmit, ChangeText: this.ChangeText, text: '', clear:this.clear});
  }
  onSubmit = (text) => {
    this.setState({animating: true})
    var str = text.replace(" ", "-")
    fetch("https://baomoi.press/wp-json/wp/v2/posts?search=" + str +"&per_page=20" )
    .then(res => res.json())
    .then(json => this.setState({
        results: json,
      animating: false,
    }))
    .catch(err => console.log(err))
  }

  render(){
    return(
      <Consumer>
        {({textColor, backGround, fontSizeRatio}) => (
            <View>
              <ActivityIndicator
                  animating = {this.state.animating}
                  color = '#696969'
                  size = "large"
                  style = {{
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 20,
                            marginBottom: 20,
                            backgroundColor: backGround
                            }}/>


                  <FlatList
                        data={this.state.results}
                        style={{backgroundColor: backGround}}
                        renderItem={({ item }) =>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => this.props.navigation.push("Article", {
                                Article: item
                            })}
                            style={{backgroundColor:backGround}}
                        >
                            <View style={{flex: 1, flexDirection: "row", marginTop: 20, backgroundColor:backGround}}>
                                <View style={{flex: 2}}>
                                  <BaomoiText style={{fontSize:18*fontSizeRatio, color:textColor}}>{item.title.plaintitle}</BaomoiText>
                                </View>
                                <Image
                                    source={{uri :item.thumb || defaultImg}}
                                    style={{height: 80, width: 180, flex: 1}}
                                />
                            </View>
                                <BaomoiText style={{fontSize:15*fontSizeRatio, color: '#696969', marginTop: 10}} numberOfLines={2}>{item.excerpt.plainexcerpt}</BaomoiText>
                                <Divider style={{ backgroundColor: '#e0e0e0', marginTop:10 }} />
                        </TouchableOpacity>
                        }
                        keyExtractor={(item, index) => index.toString()}
                    />
              </View>
          )}
        </Consumer>
    )
  }

}
