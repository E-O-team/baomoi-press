import React from 'react';
// import Articles from './Articles';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    SafeAreaView,
    Dimensions
} from 'react-native';
import Video from './Video';
import FeaturedPost from './FeaturedPost';
import Post3Pic from './Post3Pic';
import Post1Pic from './Post1Pic';
import { ListItem, List, Tile, Card, Divider, Icon } from 'react-native-elements';
import {Consumer} from '../../context/context.js'
import { BaomoiText } from '../StyledText';
import moment from 'moment/min/moment-with-locales'
import spinner from '../../assets/images/spinner.gif';
import BannerAd from '../Ads/BannerAd';
import Notification from './Notification';
import ArticleAd from '../Ads/ArticleAd';
import axios from 'axios';
const defaultImg ='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png';
var { width, height } = Dimensions.get('window');
moment.locale('vi');

export default class Articles extends React.Component {
    constructor(props){
        super(props);
        this.state={
            numberOfComments: 0
        }
    }
    componentDidMount() {
        this.cancelTokenSource = axios.CancelToken.source()
        axios.get('https://baomoi.press/wp-json/wp/v2/comments?post=' + this.props.item.id, {
            cancelToken: this.cancelTokenSource.token
        })
        .then(res => this.setState({
            numberOfComments: parseInt(res.headers['x-wp-total'], 10)
        }))
        .catch(err => {
            if(axios.isCancel(err)){
                return
            }else{
                console.log(err)
            }
        })
    }

    componentWillUnmount() {
        this.cancelTokenSource && this.cancelTokenSource.cancel()
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(this.state.numberOfComments !== nextState.numberOfComments){
            return true
        }
        if(this.props.item !== nextProps.item){
            return true
        }
        return false
    }

    shuffle = (array) => {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
        }

        return array;
    }

    render(){
        Comments = (props) => {
            if(this.state.numberOfComments != 0){
                return(
                  <View style={{flexDirection: "row", alignItems: "center"}}>
                      <BaomoiText style={{color: '#696969', fontSize: 15}}> - {this.state.numberOfComments} </BaomoiText>
                      <Icon containerStyle={{marginTop: -2}} name='comment' type="evilicon" color='#696969' size={20}/>
                  </View>
                )
            }else{
                return null;
            }

        }

        Post = (prop) => {
            const item = prop.item
            const ui = prop.ui
            const index = prop.index
            if(item.format === "video"){
                // post with video format
                return <Video item={item} ui={ui} index={index} navigation={this.props.navigation}/>
            }else if (this.props.notification == true) {
                return <Notification item={item} ui={ui} index={index} navigation={this.props.navigation}/>
            }else{
                if(item.featured_post == "on"){
                    if(index === 0){
                        return (
                                <FeaturedPost item={item} ui={ui} index={index} navigation={this.props.navigation}/>
                        )

                    }else{
                        // return null after first render of featured post
                        return null
                    }
                }else{
                    if (item.content.images.length >= 3){
                        // post with more than 3 pic
                        return <Post3Pic item={item} ui={ui} index={index} navigation={this.props.navigation}/>
                    }else {
                        // post with less than 3 pic
                        return <Post1Pic item={item} ui={ui} index={index} navigation={this.props.navigation}/>
                    }
                }

            }
        }
        const item = this.props.item
        const index = this.props.index
        const ChoosenAd = () => {
            let AdTypes = ["Banner", "Article"]
            let sizes = ["large", "small", "rectangle"]
            let ChoosenAd = this.shuffle(AdTypes)
            let ChoosenSize = this.shuffle(sizes)
            if(ChoosenAd[0] == "Banner"){
                return <BannerAd size={ChoosenSize[0]} AdPosition="List Home"/>
            }else if (ChoosenAd[0] == "Article") {
                return <ArticleAd/>
            }


        }
        return(
          <Consumer>
            {({textColor, backGround}) => (
            <View style={{backgroundColor: backGround}}>
                {(index == 0 && !this.props.notification) &&
                    <View>
                        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 10}}>
                            <Text style={{fontSize: 15, fontWeight: "bold", color: textColor}}>SỰ KIỆN NÓNG</Text>
                            <Icon
                                name='share-google'
                                type='evilicon'

                            />
                        </View>
                        <Divider style={{ backgroundColor: '#e0e0e0'}}/>
                        <BannerAd size="small" AdPosition="Sự kiện nóng"/>
                        <View style={{backgroundColor: "#e0e0e0", height: 10, width: width}}></View>
                    </View>
                }

                <Post item={item} ui={{textColor}} index={index} notification={this.props.notification}/>

                <Divider style={{ backgroundColor: '#e0e0e0'}} />

                {(index % 6 == 0 && !this.props.notification) &&
                    <View>
                        <ChoosenAd/>
                        <Divider style={{ backgroundColor: '#e0e0e0'}} />
                    </View>
                }
            </View>
          )}
          </Consumer>
        )
    }
}
