import React, { Component } from 'react';
import { View, Button,TextInput } from 'react-native';
import { Header, SearchBar } from 'react-native-elements';
import { Stitch, RemoteMongoClient,AnonymousCredential } from "mongodb-stitch-react-native-sdk";
const MongoDB = require('mongodb-stitch-react-native-services-mongodb-remote');
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import Confetti from "react-native-confetti";

class PrepareScreen extends Component {
  constructor(props) {
    super(props);
    this.state={
      currentUserId: undefined,
      client: undefined,
      tasks: undefined,
      atlasClient: undefined,
      myData: undefined,
      search: undefined,
      location: undefined
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
      this.setState({atlasClient : dbClient});
      this.setState({myData : dbClient.db("MyData")});
    });
   
  }

    _onPressSubmit = async() =>{


      var query = "";
      var collection = "";
      if("where" == String(this.state.search).substring(0,5))
      {

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
        query = { "CITY": { "$eq": geocode[0].city}};
        
        collection = this.state.myData.collection("ulta_store");
      
      }
      else{
        collection = this.state.myData.collection("ulta_product");
        query = { "DESCRIPTION": { "$regex": ". *"+this.state.search+".*"}};
      }
      const projection = { "_id": 0 };
      return collection.find(query, projection)
      .toArray()
      .then(items => {
        console.log(`Successfully found ${items.length} documents.`)
        items.forEach(console.log)
        return items
      })
      .catch(err => console.error(`Failed to find documents: ${err}`))  };
    

  render() {
    const { search } = this.state;
    return(
      <View style={{marginTop:20}}>
        <Header leftComponent={{ icon: 'whatshot' }}
          statusBarProps={{ barStyle: 'light-content' }}
          barStyle="light-content"
          centerComponent={{ text: 'Spice Up The Night', style: { color: '#fff' } } }
          containerStyle={{
          backgroundColor: '#3D6DCC',
          justifyContent: 'space-around',
          }}
        />
        <TextInput
          placeholder="Type Here..."
          onChangeText={(text) => this.setState({search: text})}
        />
        <Button
          title="Search"
          color="red"
          onPress = {this._onPressSubmit}
			  />
      </View>
    );
  }
}

export default PrepareScreen;