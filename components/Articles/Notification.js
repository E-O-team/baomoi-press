import React from 'react';
import {
    TouchableOpacity,
    View,
    Image,
    Dimensions,
    Text
} from 'react-native';
import { Divider, Icon } from 'react-native-elements';
import {Consumer} from '../../context/context.js'
import { BaomoiText } from '../StyledText';
import moment from 'moment/min/moment-with-locales'
import spinner from '../../assets/images/spinner.gif';
import dateFormat from 'dateformat';
var { width, height } = Dimensions.get('window');
moment.locale('vi');
const defaultImg ='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png';

export default class notification extends React.PureComponent {

    render(){
        const item = this.props.item
        const ui = this.props.ui
        const index = this.props.index
        console.log(this.props.item);
        const title = this.props.item.title.rendered
        const excerpt = this.props.item.excerpt.rendered
        const {id} = this.props.item
        const date = this.props.item.modified
        return(
            <Consumer>
                {({backGround, textColor}) => (
                    <View style={{padding: 10}}>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => this.props.navigation.navigate("NotificationsDetail", {
                                data: item,
                            })}
                        >
                            <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                                <View>
                                    <View>
                                        <Text style={{fontWeight: "bold", fontSize: 20, color: textColor}}>{title}</Text>
                                    </View>
                                    <View>
                                        <Text style={{color: textColor}}>{dateFormat(date, "dd-mm-yyyy")}</Text>
                                    </View>
                                </View>
                                <View>
                                    <Icon
                                        name='angle-right'
                                        type='font-awesome'
                                        color='#696969'
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
            </Consumer>
        )
    }
}
