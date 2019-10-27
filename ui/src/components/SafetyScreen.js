import React from "react";
import { StyleSheet,Text, View, Dimensions } from "react-native";
import GetLocation from './GetLocation';
import { Permissions } from 'expo'
import MapView from 'react-native-maps';

export default class SafetyScreen extends React.Component {
  state = {
    latitude: null,
    longitude: null,
  }

  async DidMount() {
    const { status } = await Permissions.getAsync(Permissions.LOCATION)

    if(status !== 'granted') {
      const response = await Permissions.askAsync(Permissions.LOCATION)
    }
  }

  getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(position => {
      console.log(position);},
       err => console.log(err));
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Keep your friends safe, make sure they get home.</Text>
        <Text>Let's get a location!</Text>
        <GetLocation onmyLocation={this.getUserLocation} /> 
        <MapView style={{flex: 1 }}
        initialRegion = {{
          //latitude,
          //longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }} >
          </MapView>
      </View>
      // <View style={styles.container}>
      //   <Text>Keep your friends safe, make sure they get home.</Text>
      //   <Text>Let's get a location!</Text>
      //   <GetLocation onmyLocation={this.getUserLocation} /> 
      // </View>
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
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  }
});