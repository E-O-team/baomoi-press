import React from 'react';
// import DatePickerAndroid from 'react-native';
import { View, DatePickerAndroid,TouchableOpacity  } from 'react-native';
import dateFormat from 'dateformat';
import { Button, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
    async function DatePickerandroid {
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
export {DatePickerandroid}
