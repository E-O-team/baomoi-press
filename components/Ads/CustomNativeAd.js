import React from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    Linking,
    SafeAreaView,
    Dimensions
} from 'react-native';
import { Divider, Icon } from 'react-native-elements';
import BaomoiText from '../StyledText'

const screenWidth = Dimensions.get('window').width;

export default class CustomNativeAd extends React.Component{
  constructor(props) {
    super(props)

  }
  render(){
        return(
          <View>
            <TouchableOpacity style={{flex: 1, flexDirection: "row", alignItems:'center'}} onPress={() => Linking.openURL(this.props.Ad.acf.customAdURL)}>
                <View style={{flex: 2}}>
                    <View style={{flexDirection: "row", alignItems:'center'}}>

                             <Text style={{color: '#696969', fontSize: 15}}>{this.props.Ad.acf.sponsored}</Text>

                              <Text style={{color: '#696969', fontSize: 15}}>{this.props.Ad.acf.sponsor_name}</Text>

                    </View>
                    <Text style={{fontSize: 20, fontWeight: '500'}}>{this.props.Ad.acf.custom_title}</Text>
                </View>
                <Image
                    source={{uri :this.props.Ad.acf.customAdImageURL}}
                    style={{height: 90, flex: 1, marginLeft: 5, borderRadius: 5}}
                />
            </TouchableOpacity>
        </View>
      )
        }
}
