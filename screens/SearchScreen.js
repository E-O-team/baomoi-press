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
        <View
          style={{
            flexDirection: "row",
            height: 50,
            marginTop: Platform.OS == "ios" ? 20 : 0 // only for IOS to give StatusBar Space
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
      <View style={{backgroundColor:'#e0e0e0'}}>
        <View style={{marginTop: 20, padding: 10, backgroundColor:"white"}}>
          <ActivityIndicator
              animating = {this.state.animating}
              color = '#696969'
              size = "large"
              style = {{flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        }}/>

            <FlatList
                  data={this.state.results}
                  renderItem={({ item }) =>
                  <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={() => this.props.navigation.push("Article", {
                          Article: item
                      })}
                  >
                      <View style={{flex: 1, flexDirection: "row", marginTop: 20}}>
                          <View style={{flex: 2}}>
                            <Text style={{fontSize:18}}>{item.title.plaintitle}</Text>
                          </View>
                          <Image
                              source={{uri :item.thumb || defaultImg}}
                              style={{height: 80, width: 180, flex: 1}}
                          />
                      </View>
                          <Text style={{fontSize:15, color: '#696969', marginTop: 10}} numberOfLines={2}>{item.excerpt.plainexcerpt}</Text>
                          <Divider style={{ backgroundColor: '#e0e0e0', marginTop:10 }} />
                  </TouchableOpacity>
                  }
                  keyExtractor={(item, index) => index.toString()}
              />
        </View>
      </View>
    )
  }

}
