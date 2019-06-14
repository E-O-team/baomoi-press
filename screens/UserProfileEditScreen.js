import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, AsyncStorage, Platform, DatePickerAndroid, SafeAreaView, Picker} from 'react-native';
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
                        height: 50,
                        flexDirection: "row",
                        backgroundColor: backGround,
                        alignItems:'center',
                        borderBottomWidth: 1,
                        borderBottomColor: '#C0C0C0'
                        }}
                    >
                        <TouchableOpacity   style={{flex: 1, alignItems: 'center'}}
                                            onPress={() => {
                                                navigation.goBack()
                                            }}>
                            <Icon
                                name='chevron-left'
                                size={40}
                                color={textColor}
                            />
                        </TouchableOpacity>
                        <View style={{flex : 5}}></View>
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
            gender: user.gender || "Nam",
            so_thich: user.so_thich || "Nghe nhạc",
            mobile_number: user.mobile_number,
            user_email: user.user_email,
            token: token,
        })
    }

    handleSubmit = () => {
        const data = new FormData()
        data.append("birth_date", this.state.birth_date)
        data.append("gender", this.state.gender)
        data.append("so_thich", this.state.so_thich)
        data.append("mobile_number", this.state.mobile_number)
        data.append("user_email", this.state.user_email)
        axios({
            method: "POST",
            url: 'https://baomoi.press/wp-json/wp/v2/update_user_info',
            headers: {'Authorization': 'Bearer ' + this.state.token},
            data: data
        })
        .then(res => {
            this.goOut()
        })
        .catch(err => console.log(err))
    }

    goOut = async () => {
        this.props.navigation.pop(2)
        this.props.navigation.openDrawer()
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
                <FormLabel labelStyle={styles.formLabel}>Email</FormLabel>
                <FormInput placeholder={user.user_email || 'Điền email'} onChangeText={(text) => this.setState({user_email: text})} inputStyle={styles.formInput}/>
                <FormLabel labelStyle={styles.formLabel}>Giới tính</FormLabel>
                <Picker
                  selectedValue={this.state.gender}
                  style={{height: 50, width: 100, marginLeft: 15}}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({gender: itemValue})
                  }>
                  <Picker.Item label="Nam" value="Nam" />
                  <Picker.Item label="Nữ" value="Nữ" />
                </Picker>
                <FormLabel labelStyle={styles.formLabel}>Sở thích</FormLabel>
                <Picker
                  selectedValue={this.state.so_thich}
                  style={{height: 50, width: 150, marginLeft: 15}}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({so_thich: itemValue})
                  }>
                  <Picker.Item label="Nghe nhạc" value="Nghe nhạc" />
                  <Picker.Item label="Xem phim" value="Xem phim" />
                  <Picker.Item label="Đá bóng" value="Đá bóng" />
                  <Picker.Item label="Caffe" value="Caffe" />
                </Picker>
                <FormLabel labelStyle={styles.formLabel}>Số điện thoại</FormLabel>
                <FormInput placeholder={user.mobile_number || 'Điền số điện thoại'} textContentType='telephoneNumber' onChangeText={(text) => this.setState({mobile_number: text})} inputStyle={styles.formInput}/>
                <Button
                    buttonStyle={styles.button}
                    title="Lưu"
                    onPress={this.handleSubmit}
                />

                <Text style={{color: '#696969', marginHorizontal: 10, marginTop: 20, marginLeft: 15}}>Lưu ý: bạn cần điền đầy đủ thông tin trước khi thực hiện đổi quà</Text>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    button:{
        marginTop: 10,
        backgroundColor: '#e12f28',
        marginHorizontal: 10
    },
    formLabel: {
        fontSize: 16
    },
    formInput: {
        borderBottomWidth:1, borderBottomColor:'#C0C0C0', marginLeft: 5, fontSize: 15
    },
})
