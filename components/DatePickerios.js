import React, { Component } from 'react'
import {
  DatePickerIOS,
  View,
  StyleSheet,
} from 'react-native'
import { Button, FormLabel } from 'react-native-elements';
export default class DatePickerios extends Component {
  constructor(props) {
    super(props);
    this.state = { chosenDate: new Date(this.props.date) };
  }

  // <DatePickerIOS
  //   date={this.props.date}
  //   onDateChange={this.props.handleOnDateChange}
  //   maximumDate={new Date()}
  //   mode="date"
  // />

  setDate = () => {
      this.setState({chosenDate: new Date("2019-01-17T17:00:00.000Z")})
  }

  onDateChange = (newDate) => {
      this.setState({chosenDate: newDate},
          () => {
              this.props.handleOnDateChange(this.state.chosenDate)
      }
  )
  }

  render() {
    return (
      <View>
          <FormLabel>Ngày sinh</FormLabel>
          <View style={styles.container}>
              <DatePickerIOS
                date={this.state.chosenDate}
                onDateChange={this.onDateChange}
                maximumDate={new Date()}
                mode="date"
              />
          </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
})
