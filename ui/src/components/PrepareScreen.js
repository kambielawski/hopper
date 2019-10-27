import React, { Component } from 'react';
import { View, TextInput, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { Header, SearchBar, Button } from 'react-native-elements';
import { Stitch, RemoteMongoClient, AnonymousCredential } from "mongodb-stitch-react-native-sdk";
const MongoDB = require('mongodb-stitch-react-native-services-mongodb-remote');
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import Confetti from "react-native-confetti";

class PrepareScreen extends Component {
  static navigationOptions = {
    title: "Spice Up The Night"
  }

  constructor(props) {
    super(props);
    this.state = {
      currentUserId: undefined,
      client: undefined,
      tasks: undefined,
      atlasClient: undefined,
      myData: undefined,
      search: undefined,
      location: undefined,
      res: [],
    };
    this._loadClient = this._loadClient.bind(this);
    this._onPressSubmit = this._onPressSubmit.bind(this);

  }

  componentDidMount() {
    this._loadClient();
  }

  _loadClient() {
    Stitch.initializeDefaultAppClient('hopper-ylufi').then(client => {
      this.setState({ client });
      client.auth.loginWithCredential(new AnonymousCredential()).then(user => {
        console.log(`Successfully logged in as user ${user.id}`);
        this.setState({ currentUserId: user.id })
      }).catch(err => {
        console.log(`Failed to log in anonymously: ${err}`);
        this.setState({ currentUserId: undefined })
      });
      const dbClient = client.getServiceClient(MongoDB.RemoteMongoClient.factory, "mongodb-atlas");
      this.setState({ atlasClient: dbClient });
      this.setState({ myData: dbClient.db("MyData") });
    });

  }

  getImages = async () => {
    let pics = await fetch(`https://pixabay.com/api/?key=14077809-0fb00ab558b80f5a4594810cc&q=${this.state.search}&image_type=photo`);
    const obj = await pics.json();
    obj.hits.map(hit => this.images.push(hit.previewURL));
    const preview = obj.hits[i.index].previewURL;
    console.log(this.state.images);

    return <Image source={{ uri: preview }} style={{ width: 100, height: 100 }} />;
  }

  _onPressSubmit = async () => {

    var query = "";
    var collection = "";
    if ("where" == String(this.state.search).substring(0, 5)) {

      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        this.setState({
          errorMessage: 'Permission to access location was denied',
        });
      }
      let location = await Location.getCurrentPositionAsync({});
      this.setState({ location });
      console.log(location);
      var obj = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }
      let geocode = await Location.reverseGeocodeAsync(obj);
      query = { "CITY": { "$eq": geocode[0].city } };

      collection = this.state.myData.collection("ulta_store");

    }
    else {
      collection = this.state.myData.collection("ulta_product");
      query = { "DESCRIPTION": { "$regex": ". *" + this.state.search + ".*" } };
    }
    const projection = { "_id": 0 };
    return collection.find(query, projection)
      .toArray()
      .then(items => {
        console.log(`Successfully found ${items.length} documents.`)
        return items
      })
      .catch(err => console.error(`Failed to find documents: ${err}`))
  };

  renderItem = i => {
    return (
      <View>
        <Text style={{ ...styles.itemTextStyle, fontWeight: 'bold', fontSize: 18, marginLeft: 15, marginTop: 15 }}>{i.item.DISPLAY_NAME}</Text>
        <View style={styles.itemBoxStyle}>
            <Text style={{ marginLeft: 15, alignSelf: 'left', color: 'white', fontSize: 18 }}>{i.item.BRAND_NAME}</Text>
            <Text style={{ marginLeft: 15, fontSize: 24, color: 'white', alignSelf: 'right', width: 250, flex: 1 }}>${i.item.LIST_PRICE}</Text>
        </View>
      </View>
    )
  }


  render() {
    const { search } = this.state;
    return (
      <View>
        <View style={{ marginTop: 20 }}>
          {/* <Header leftComponent={{ icon: 'whatshot' }}
            statusBarProps={{ barStyle: 'light-content' }}
            barStyle="light-content"
            centerComponent={{ text: 'Spice Up The Night', style: { color: '#fff' } }}
            containerStyle={{
              backgroundColor: '#3D6DCC',
              justifyContent: 'space-around',
            }}
          /> */}
          <TextInput
            style={{ height: 40, fontSize: 18, marginLeft: 20 }}
            onChangeText={(text) => this.setState({ search: text })}
            placeholder="Type Here..."
          />
          <Button
            style={{ marginLeft: 15, marginRight: 15, marginBottom: 15 }}
            title="Search"
            onPress={() => this._onPressSubmit().then(stuff => this.setState({ res: stuff }))}
          />
        </View>
        <View>
          {this.getImages}
          <FlatList
            data={this.state.res}
            renderItem={i => this.renderItem(i)}
            keyExtractor={i => i.index}
          />
        </View>
      </View>
    );
  }
}

const styles = {
  itemBoxStyle: {
    backgroundColor: '#c54040',
    flex: 1,
    flexDirection: 'col',
    borderRadius: 2,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  itemTextStyle: {
    color: '#8A1A1A',
    fontSize: 16,
  }
}

export default PrepareScreen;