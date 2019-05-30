import React from 'react';
// import DatePickerAndroid from 'react-native';
import { View, DatePickerAndroid,TouchableOpacity, StyleSheet  } from 'react-native';
import dateFormat from 'dateformat';
import { Button, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
export default class DatePickerandroid extends React.Component {
    constructor(props){
        super(props)
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(this.props.date !== nextProps.date){
            return true
        }else{
            return false
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
    }


    calendarLaunched = async() => {

        try {
            const {action, year, month, day} = await DatePickerAndroid.open({
                // Use `new Date()` for current date.
                // May 25 2020. Month 0 is January.
                date: new Date(this.props.date),
                mode: "spinner"
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                if(action == DatePickerAndroid.dateSetAction){
                    var birth_date = new Date(year, month, day);
                    this.props.handleOnDateChange(birth_date)
                }
                // Selected year, month (0-11), day

            }
        }
        catch ({code, message}) {
            console.warn('Cannot open date picker', message);
        }
    }
    render(){
        return(
            <TouchableOpacity
                onPress={this.calendarLaunched}
            >
                <FormLabel labelStyle={styles.formLabel}>Ngày sinh</FormLabel>
                <FormInput placeholder={"Nhấp vào để chọn ngày sinh"} editable={false} inputStyle={styles.formInput}/>
            </TouchableOpacity>
        )
    }
};
const styles = StyleSheet.create({
    formLabel: {
        fontSize: 16
    },
    formInput: {
        marginLeft: 5, fontSize: 15
    }
})
