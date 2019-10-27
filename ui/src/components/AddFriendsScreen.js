import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, View, TextInput, FlatList } from 'react-native';
import { Button } from 'react-native-elements';

import { AddNumber } from '../actions/PlanActions';

class AddFriendsScreen extends Component {
  static navigationOptions = {
    title: "Add Friends"
  }

  state = {
    numberText: null,
  }

  onChangeText = text => {
    this.setState({ numberText: text })
    console.log(this.state.numberText);
  }

  renderPhoneNumber = number => {
    console.log('numba: ', number);
    return (
      <View style={styles.numViewStyle}>
        <Text style={styles.numTextStyle}>
          {number.item}
        </Text>
      </View>
    );
  }

  addFriend = () => {
    if (this.state.numberText) {
      console.log(this.state.numberText);
      this.props.AddNumber(this.state.numberText);
      this.setState({ numberText: '' });
    }
  }

  render() {
    return (
      <View style={{ marginTop: 10 }}>
        <TextInput
          keyboardType='number-pad'
          style={{ height: 40, fontSize: 18, marginLeft: 20 }}
          onChangeText={text => this.onChangeText(text)}
          value={this.state.numberText}
          placeholder={"Who's coming?"}
        />
        <Button style={{ marginLeft: 20, marginRight: 20, marginBottom: 10 }} title="Add Number" onPress={() => this.addFriend()} />
        <FlatList
          data={this.props.PlanReducer.numbers}
          renderItem={phoneNumber => this.renderPhoneNumber(phoneNumber)}
          keyExtractor={item => item.index}
        />
        <Button style={{ marginLeft: 20, marginRight: 20, marginTop: 20 }} title="Next" onPress={() => this.props.navigation.navigate('Finish')} />
      </View>
    );
  }
}

const styles = {
  numViewStyle: {
    backgroundColor: '#c54040',
    flex: 1,
    flexDirection: 'col',
    borderRadius: 2,
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
  },
  numTextStyle: {
    color: 'white',
    fontSize: 16,
    paddingTop: 12,
    paddingBottom: 12,
  }
}

const mapStateToProps = state => {
  const { PlanReducer } = state;

  return { PlanReducer };
}

export default connect(mapStateToProps, { AddNumber })(AddFriendsScreen);