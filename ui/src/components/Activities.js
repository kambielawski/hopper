import React, { Component } from 'react';
import { Text, View, StyleSheet, TextInput } from 'react-native';
import { connect } from 'react-redux';
import MapView, { Marker } from 'react-native-maps';
import { Card, Button } from 'react-native-elements';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { AppLoading } from 'expo';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

import { AddLocation } from '../actions/PlanActions';

const FOUR_SQUARE_CLIENT_ID = "ZJAG3DIZCQMXGZVRCJX4KEWBYRXTZUC5MVSHY5SHZZ2RLFKE";
const FOUR_SQUARE_CLIENT_SECRET = "X2WPORTIEGVD54KYSOWPBB30IWTE1DCANFRIDXQTAK1YJPEQ";

class LocationScreen extends Component {

  static navigationOptions = {
    title: "Location"
  };

  state = {
    markers: [],
    currentLocationLatitude: null,
    currentLocationLongitude: null,
    venues: undefined,
    errorMessage: undefined,
    region: undefined,
    loading: true,
    selectedMarker: undefined,
    searchText: '',
    tableHead: ['', 'Jeffersons (9:00)', 'Frosties (10:00)', 'McDonalds (11:30)'],
      tableTitle: ['', 'Person 1', 'Person 2', 'Person 3', 'Person 4', 'Person 5'],
      tableData: [
        ['Going', 'Pass', 'Going'],
        ['Pass', 'Going', 'Pass'],
        ['Pass', 'Pass', 'Pass'],
        ['Going', 'Going', 'Going'],
        ['Pass', 'Going', 'Going']

      ]
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

    this.setState({markers: []});

    const SEARCH_LATITUDE = this.state.currentLocationLatitude;
    const SEARCH_LONGITUDE = this.state.currentLocationLongitude;
    const responseLimit = 1;
    let response = await fetch(`https://api.foursquare.com/v2/venues/explore?client_id=${FOUR_SQUARE_CLIENT_ID}&client_secret=${FOUR_SQUARE_CLIENT_SECRET}&v=20180323&limit=${responseLimit}&ll=${SEARCH_LATITUDE},${SEARCH_LONGITUDE}&query=${this.state.searchText}`)
    let myjson = await response.json();
    results = myjson.response.groups[0].items;

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

  }

  renderNextButton = () => {
    if (!this.props.PlanReducer.locations[0]) {
      return null;
    }
    return (
      <Button style={{marginLeft: 20, marginRight: 20}} title="Next" onPress={() => this.props.navigation.navigate('Time')}/>
    )
  }

  renderVenuePopup = markerData => {
    if (!markerData) return null;

    let isAdded = this.props.PlanReducer.locations.indexOf(markerData) >= 0;

    return (
      <View style={{ marginBottom: 15 }}>
        <Card style={{ marginBottom: 15 }} title={markerData.name}>
          <Text style={{ alignSelf: 'center', paddingBottom: 15 }}>{markerData.description}</Text>
          {isAdded ? <Text style={{ alignSelf: 'center', color: '#199200', fontWeight: 'bold' }}>Added</Text> : <Button title="Let's go!" onPress={() => this.props.AddLocation(markerData)} />}
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
          }}
          onError={console.warn}
        />
      );
    }

    onChangeText = text => {
      this.setState({searchText: text});
    }

    return (
      <View style={styles.map}>
        <Text>Your Schedule for 10/28/19</Text>
        
          <Table borderStyle={{borderWidth: 1}}>
          <Row data={state.tableHead} flexArr={[1, 2, 1, 1]} style={styles.head} textStyle={styles.text}/>
          <TableWrapper style={styles.wrapper}>
            <Col data={state.tableTitle} style={styles.title} heightArr={[28,28]} textStyle={styles.text}/>
            <Rows data={state.tableData} flexArr={[2, 1, 1]} style={styles.row} textStyle={styles.text}/>
          </TableWrapper>
        </Table> 
        
        {this.renderNextButton()}
        {this.renderVenuePopup(this.state.selectedMarker)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  }
});

const mapStateToProps = state => {
  const { PlanReducer } = state;
  return { PlanReducer };
}

export default connect(mapStateToProps, { AddLocation })(LocationScreen);