import React from "react";
import { StyleSheet,Text, View } from "react-native";
import GetLocation from './GetLocation';
import { MapView, Permissions } from 'expo'

export default class SafetyScreen extends React.Component {
  getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(position => {
      console.log(position);},
       err => console.log(err));
  }
  state = {
    latitude: null,
    longitude: null,
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>Keep your friends safe, make sure they get home.</Text>
        <Text>Let's get a location!</Text>
        <GetLocation onmyLocation={this.getUserLocation} /> 
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});