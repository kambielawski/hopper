import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Card, Button } from 'react-native-elements';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { AppLoading } from 'expo';

const FOUR_SQUARE_CLIENT_ID = "ZJAG3DIZCQMXGZVRCJX4KEWBYRXTZUC5MVSHY5SHZZ2RLFKE";
const FOUR_SQUARE_CLIENT_SECRET = "X2WPORTIEGVD54KYSOWPBB30IWTE1DCANFRIDXQTAK1YJPEQ";

export default class LocationScreen extends Component {

  state = {
    markers: [],
    currentLocationLatitude: null,
    currentLocationLongitude: null,
    venues: undefined,
    errorMessage: undefined,
    region: undefined,
    loading: true,
    selectedMarker: undefined,
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
      console.log(this.state.errorMessage);
    }

    let currentLocation = await Location.getCurrentPositionAsync({});
    this.setState({
      currentLocationLatitude: currentLocation.coords.latitude,
      currentLocationLongitude: currentLocation.coords.longitude
    });
  };

  getVenues = async () => {

    const SEARCH_LATITUDE = this.state.currentLocationLatitude;
    const SEARCH_LONGITUDE = this.state.currentLocationLongitude;
    const responseLimit = 1;
    let response = await fetch(`https://api.foursquare.com/v2/venues/explore?client_id=${FOUR_SQUARE_CLIENT_ID}&client_secret=${FOUR_SQUARE_CLIENT_SECRET}&v=20180323&limit=${responseLimit}&ll=${SEARCH_LATITUDE},${SEARCH_LONGITUDE}&query=coffee`)
    let myjson = await response.json();
    results = myjson.response.groups[0].items;
    console.log(results);
    for (let i = 0; i < results.length; i++) {
      results[i] = {
        name: results[i].venue.name,
        latlng: {
          latitude: results[i].venue.location.lat,
          longitude: results[i].venue.location.lng,
        },
        address: results[i].venue.location.address,
        description: results[i].venue.categories[0].name,
        image: results[i].venue.categories[0].icon.prefix + results[i].venue.categories[0].icon.suffix,
      }
      this.setState({ markers: [...this.state.markers, results[i]] });
    }
    console.log(this.state.markers);

  }

  renderVenuePopup = markerData => {
    if (!markerData) return null;

    return (
      <View>
        <Card style={{marginBottom: 15}} title={markerData.name}>
          <Text style={{alignSelf: 'center', paddingBottom: 15}}>{markerData.description}</Text>
          <Button title="Let's go!" onPress={() => console.log('adding ' + markerData.name + ' to list')} />
        </Card>
      </View>
    );
  }

  render() {
    if (this.state.loading) {
      return (
        <AppLoading
          startAsync={this._getLocationAsync}
          onFinish={() => {
            this.setState({ loading: false });
            this.getVenues();
          }}
          onError={console.warn}
        />
      );
    }

    return (
      <View style={styles.map}>
        <MapView
          style={{ flex: 1 }}
          region={{
            latitude: this.state.currentLocationLatitude,
            longitude: this.state.currentLocationLongitude,
            latitudeDelta: .05,
            longitudeDelta: .05,
          }}
          onRegionChange={this.onRegionChange}
        >
          {this.state.markers.map(marker => (
            <Marker
              coordinate={marker.latlng}
              title={marker.name}
              description={marker.description}
              onPress={() => this.setState({ selectedMarker: marker })}
            />
          ))}
        </MapView>
        {this.renderVenuePopup(this.state.selectedMarker)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});