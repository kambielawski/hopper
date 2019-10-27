import React from 'react';
import { MapView, Permissions, Marker } from "react-native-maps";
import GetLocation from './GetLocation'
import { StyleSheet, Text, View, Dimensions } from 'react-native';

export default class SafetyScreen extends React.Component {
  render() {
    return (
        <View style={style.container}>
            <MapView style={StyleSheet.mapStyle}/>
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
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

