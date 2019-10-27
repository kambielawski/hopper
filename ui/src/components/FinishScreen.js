import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { Button, Card } from 'react-native-elements';

import { AddPlans } from '../actions/PlanActions';
import { FlatList } from 'react-native-gesture-handler';

class FinishScreen extends Component {

  static navigationOptions = {
    title: "Finish"
  }

  renderPlace = place => {
    console.log(place);
    return (
      <View style={{alignItems: 'center'}}>
        <Text style={{ ...styles.subTextStyle, fontWeight: 'bold' }}>{place.item.name}</Text>
        <Text style={styles.subTextStyle}>{place.item.address}</Text>
      </View>
    );
  }

  renderNumber = number => {
    console.log(number);
    return (
      <Text style={{alignSelf: "center"}}>{number.item}</Text>
    )
  }

  render() {
    console.log(this.props.PlanReducer.startTime);
    return (
      <View style={styles.viewStyle}>
        <Card title={new Date(this.props.PlanReducer.startTime).toDateString()}>
          <FlatList
            data={this.props.PlanReducer.locations}
            renderItem={spot => this.renderPlace(spot)}
            keyExtractor={spot => spot.index}
          />
          <Text style={{ ...styles.subTextStyle, alignSelf: 'center', marginTop: 15 }}>
            Friends
        </Text>
          <FlatList
            data={this.props.PlanReducer.numbers}
            renderItem={number => this.renderNumber(number)}
            keyExtractor={number => number.index}
          />
          <Button style={{ marginLeft: 20, marginRight: 20, marginBottom: 10, marginTop: 10 }} title="Finish" onPress={() => this.props.navigation.navigate('Home')} />
        </Card>
      </View>
    );
  }
}

const styles = {
  viewStyle: {
    flex: 1,
    justifyContent: 'center',
  },
  headerTextStyle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subTextStyle: {
    fontSize: 20
  }
}

const mapStateToProps = state => {
  const { PlanReducer } = state;

  return { PlanReducer };
}

export default connect(mapStateToProps, { AddPlans })(FinishScreen);