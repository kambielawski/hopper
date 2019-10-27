import React, { Component } from 'react';
import { View, Text } from 'react-native';

class AddTimeScreen extends Component {

  static navigationOptions = {
    title: "Pick a Time"
  };

  render() {
    return(
      <View>
        <Text>Time screen</Text>
      </View>
    );
  }
}

export default AddTimeScreen;