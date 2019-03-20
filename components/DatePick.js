import React from 'react';
import DatePickerios from './DatePickerios';
import DatePickerandroid from './DatePickerandroid';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, AsyncStorage, Platform, DatePickerAndroid } from 'react-native';
export default class DatePick extends React.Component {
    render(){
        if(Platform.OS == "ios"){
            return <DatePickerios date={this.props.date} handleOnDateChange={this.props.handleOnDateChange}/>
        }else if (Platform.OS == "android") {
            return <DatePickerandroid date={this.props.date} handleOnDateChange={this.props.handleOnDateChange}/>
        }
    }
};
