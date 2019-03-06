import React from 'react';
// import Articles from './Articles';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    SafeAreaView,
} from 'react-native';
import {Consumer} from '../../context/context.js';
import { ListItem, List, Tile, Card, Divider, Icon } from 'react-native-elements'

export default class Categories extends React.PureComponent {
    // constructor(props) {
    //     super(props)
    //     this.state={
    //         selectedCategories: "Home",
    //         categories:
    //     }
    // }
    // fetchCategories = () => {
    //     fetch("https://baomoi.press/wp-json/wp/v2/categories")
    //     .then(res => res.json())
    //     .then(json => this.setState({
    //         categories: json
    //     }))
    //     .catch(err => console.log(err))
    // }
    // componentWillMount() {
    //     this.fetchCategories()
    // }
    render(){
        return(
            <View style={{height: 37}}>
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    keyExtractor={item => item.id.toString()}
                    data={categories}
                    renderItem={({item}) =>
                    <Consumer>
                    {({textColor, backGround}) => (
                        <TouchableOpacity
                            onPress={() => this.setCategory(item.id)}
                            style={{
                                backgroundColor: backGround,
                                padding: 10,
                            }}
                            underlayColor="white"
                            activeOpacity={1}
                        >
                          {
                            (item.id === this.state.selectedCategory)?
                            <View>
                              <Text style={{color: "red"}}>{item.name}</Text>
                              <View style={{height: 1, backgroundColor: 'red'}}></View>
                            </View> : <Text style={{color: textColor}}>{item.name}</Text>
                          }

                        </TouchableOpacity>
                      )}
                      </Consumer>

                    }
                    keyExtractor={item => item.id.toString()}
                />
            </View>
        )
    }
}
