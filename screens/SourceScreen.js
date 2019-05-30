import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    SafeAreaView,
    ActivityIndicator,
    AsyncStorage,
    FlatList,
} from 'react-native';
import {Consumer} from '../context/context.js'
import { Avatar, Card, Icon, Button, Divider, Badge } from 'react-native-elements';
import axios from 'axios';
import Articles from '../components/Articles/Articles';
const defaultImg ='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png';
export default class SourceScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            source: this.props.navigation.getParam("source"),
            articles: [],
            page: 1
        }
    }

    static navigationOptions = ({navigation}) => {
        return {
            tabBarVisible: false,
            header: (
              <Consumer>
                {({backGround, textColor}) => (
                    <SafeAreaView
                        style={{

                            height: 50,
                            flexDirection: "row",
                            backgroundColor: backGround,
                            alignItems:'center',
                            borderBottomWidth: 1,
                            borderBottomColor: '#C6C3BC',

                        }}
                    >
                        <TouchableOpacity style={{flex: 1, alignItems: "flex-start"}}
                              onPress={() => navigation.goBack()}>
                            <Icon
                                name='chevron-left'
                                size={35}
                                color={textColor}
                            />
                        </TouchableOpacity>
                        <View style={{flex: 1, alignItems: "center"}}><Text style={{fontSize: 20, fontWeight: "bold"}}>Nguồn tin</Text></View>
                        <View style={{flex: 1}}></View>
                    </SafeAreaView>
                )}
            </Consumer>
            )
        }
    }

    componentDidMount() {
        this.cancelTokenSource = axios.CancelToken.source()
        this.fetchNews()
    }

    fetchNews = () => {
        axios.get("https://baomoi.press//wp-json/wp/v2/posts?filter[taxonomy]=source&per_page=10&page="+this.state.page+"&filter[term]=" + this.state.source.slug, {
            cancelToken: this.cancelTokenSource.token
        })
        .then(res => this.setState({
            articles: [...this.state.articles, ...res.data],
        }))
        .catch(err => {
            if(axios.isCancel(err)){
                return
            }else{
                console.log(err)
            }
        })
    }

    handleLoadMore = () => {
        this.setState({
            page: this.state.page + 1,
        }, () => this.fetchNews())
    }

    componentWillUnmount() {
        this.cancelTokenSource && this.cancelTokenSource.cancel()
    }


    render(){
        const {source} = this.state
        return(
            <Consumer>
                {({textColor, backGround}) => (
                    <View style={{backgroundColor: backGround}}>
                        <Divider style={{ backgroundColor: '#e0e0e0', height: 1}} />
                        <FlatList
                            initialNumToRender={5}
                            data={this.state.articles}
                            extraData={this.state.articles}
                            renderItem={({ item, index }) => <Articles item={item} navigation={this.props.navigation} ui={{textColor, backGround}} index={index}/>}
                            keyExtractor={item => item.id.toString()}
                            onEndReached={this.handleLoadMore}
                            removeClippedSubviews={true}
                            windowSize={15}
                            onEndReachedThreshold={0.5}
                        />
                    </View>
                )}
            </Consumer>
        )
    }
};
