import React, { Component } from 'react';
import { View, Text, DatePickerIOS } from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import TimePicker from './TimePicker';

import { AddStartTime } from '../actions/PlanActions';
// import DateTimePicker from '@react-native-community/datetimepicker';

class AddTimeScreen extends Component {
  static navigationOptions = {
    title: "Pick a Time"
  }

  constructor(props) {
    super(props);
    this.state = { startTime: new Date() };

    this.setDate = this.setDate.bind(this);
  }

  setDate(newDate) {
    this.setState({ startTime: newDate });
    this.props.AddStartTime(newDate);
  }

  render() {
    return (
      <View style={styles.viewStyle}>
        <DatePickerIOS date={this.state.startTime} onDateChange={this.setDate}  />
        <Button style={{marginLeft: 20, marginRight: 20}} title="Next" onPress={() => this.props.navigation.navigate('AddFriends')} />
      </View>
    );
  }
}

const styles = {
  viewStyle: {
    flex: 1,
    justifyContent: 'center',
  }
}

const mapStateToProps = state => {
  const { startTime } = state.PlanReducer;

  return { startTime };
}

export default connect(mapStateToProps, { AddStartTime })(AddTimeScreen);