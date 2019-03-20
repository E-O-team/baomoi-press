import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, AsyncStorage, Platform, DatePickerAndroid, SafeAreaView } from 'react-native';
import axios from 'axios';
import DatePickerios from '../components/DatePickerios';
import DatePickerandroid from '../components/DatePickerandroid';
import DatePick from '../components/DatePick';
import {Consumer} from '../context/context.js'
import dateFormat from 'dateformat';
import { Button, FormLabel, FormInput, FormValidationMessage, Icon } from 'react-native-elements';
export default class UserProfileEdit extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            user: {}
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
                        height: 60,
                        marginTop: 20,
                        flexDirection: "row",
                        backgroundColor: backGround,
                        alignItems:'center',
                        borderBottomWidth: 1,
                        borderBottomColor: '#C6C3BC'
                        }}
                    >
                        <View>
                            <Icon
                                name='chevron-left'
                                size={35}
                                color={textColor}
                                onPress={() => {
                                    navigation.goBack()
                                }}
                            />
                        </View>
                    </SafeAreaView>
                )}
            </Consumer>
            )
        }
    }
    componentWillMount() {
        const user = this.props.navigation.getParam("user", null)
        const token = this.props.navigation.getParam("token", null)
        this.setState({
            user: user,
            birth_date: user.birth_date,
            gender: user.gender,
            so_thich: user.so_thich,
            mobile_number: user.mobile_number,
            token: token,
        })
    }

    handleSubmit = () => {
        const data = new FormData()
        data.append("birth_date", this.state.birth_date)
        data.append("gender", this.state.gender)
        data.append("so_thich", this.state.so_thich)
        data.append("mobile_number", this.state.mobile_number)
        axios({
            method: "POST",
            url: 'https://baomoi.press/wp-json/wp/v2/update_user_info',
            headers: {'Authorization': 'Bearer ' + this.state.token},
            data: data
        })
        .then(res => {
            this.logOut()
        })
        .catch(err => console.log(err))
    }

    logOut = async () => {
        AsyncStorage.clear()
        this.props.navigation.navigate("Auth")
    }

    handleOnDateChange = (newDate) => {
        this.setState({birth_date: newDate.toString()})
    }

    calendarLaunched = async(date) => {
        // console.log(date);
        try {
            const {action, year, month, day} = await DatePickerAndroid.open({
                // Use `new Date()` for current date.
                // May 25 2020. Month 0 is January.
                date: new Date(date),
                mode: "spinner"
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                if(action == DatePickerAndroid.dateSetAction){
                    var birth_date = new Date(year, month, day);
                    this.handleOnDateChange(birth_date)
                }
                // Selected year, month (0-11), day

            }
        }
        catch ({code, message}) {
            console.warn('Cannot open date picker', message);
        }
    }


    render(){
        const {user} = this.state
        return(
            <ScrollView
                horizontal={false}
            >

                <DatePick date={user.birth_date} handleOnDateChange={this.handleOnDateChange}/>
                <FormLabel>giới tính</FormLabel>
                <FormInput placeholder={user.gender} onChangeText={(text) => this.setState({gender: text})}/>
                <FormLabel>sở thích</FormLabel>
                <FormInput placeholder={user.so_thich} onChangeText={(text) => this.setState({so_thich: text})}/>
                <FormLabel>số điện thoại</FormLabel>
                <FormInput placeholder={user.mobile_number} onChangeText={(text) => this.setState({mobile_number: text})}/>

                <Button
                    buttonStyle={styles.button}
                    title="Lưu"
                    onPress={this.handleSubmit}
                />

                <Text style={{color: '#696969', marginHorizontal: 10, marginTop: 20}}>Lưu ý: bạn cần điền đầy đủ thông tin trước khi thực hiện bình luận bài viết</Text>
            </ScrollView>
        )
    }
}

styles = StyleSheet.create({
    button:{
        marginTop: 10,
        backgroundColor: '#e12f28',
        marginHorizontal: 10
    }
})
