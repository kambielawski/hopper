import React, { Component } from 'react';
import { DatePickerIOS, View, StyleSheet, Platform } from 'react-native';

export default class TimePicker extends Component {
  constructor(props) {
    super(props);
    this.state = { chosenDate: new Date() };

    this.setDate = this.setDate.bind(this);
  }

  setDate(newDate) {
    this.setState({ chosenDate: newDate });
  }

  render() {
    return (
      <View style={styles.container}>
        {(Platform.OS === 'ios') ? <DatePickerIOS date={this.state.chosenDate} onDateChange={this.setDate}  /> : this.Android()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});