import React, { Component } from 'react';
import { View, Button } from 'react-native';
import { Header, SearchBar } from 'react-native-elements';
import {
  Stitch,
  RemoteMongoClient,
  BSON
} from "mongodb-stitch-browser-sdk";


const items = mongodb.db("MyData").collection("ulta_product");
const product_avail = mongodb.db("MyData").collection("ulta");
const stores = mongodb.db("MyData").collection("ulta_store");

class PrepareScreen extends Component {

  onstructor() {
    super();
    this.state = {
      value: "",
      result: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.displayItems = this.displayItems.bind(this);
    this.addItem = this.addItem.bind(this);
  }
  
  componentDidMount() {
    // Initialize the App Client
    this.client = Stitch.initializeDefaultAppClient("hopper-ylufi");
    // Get a MongoDB Service Client
    // This is used for logging in and communicating with Stitch
    const mongodb = this.client.getServiceClient(
      RemoteMongoClient.factory,
      "mongodb-atlas"
    );
    // Get a reference to the todo database
    this.db = mongodb.db("MyData");
    this.displayItemsOnLoad();
  }
  
  displayItems() {
    // query the remote DB and update the component state
    this.db
      .collection("ulta_product")
      .find({}, { limit: 100 })
      .asArray()
      .then(result => {
        this.setState({result});
      });
   }
  displayItemsOnLoad() {
    // Anonymously log in and display comments on load
    this.client.auth
      .loginWithCredential(new AnonymousCredential())
      .then(this.displayItems)
      .catch(console.error);
  }
  findItem(event) {
    event.preventDefault();
    const { value } = this.state;
    // insert the todo into the remote Stitch DB
    // then re-query the DB and display the new todos

    const query = { "DESCRIPTION": { "$regex": ".* "+value + " .*" } };
    const options = {
      "projection": { "_id": 0 },
      "sort": { "DISPLAY_NAME": 1 }
    };

    this.db
      .collection("ulta_product")
      .find(query, options)
      .asArray()
      .then(result => {
        this.setState({result});
      });
  }
  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  

  render() {
    return(
      <View style={{marginTop:20}}>
        <Header leftComponent={{ icon: 'whatshot' }}
          statusBarProps={{ barStyle: 'light-content' }}
          barStyle="light-content"
          centerComponent={{ h3: 'Spice Up The Night', style: { color: '#fff' } } }
          containerStyle={{
          backgroundColor: '#3D6DCC',
          justifyContent: 'space-around',
          }}
        />
        <form onSubmit={this.addItem}>
          <SearchBar 
            placeholder="Type Here..."
            onChangeText={this.handleChange}
            value={this.state.value}
          />
          <input type="submit" value="Submit" 
            title="Search"
            color="red"
          />
        </form>
        <ul>
          {/* Map over the todos from our remote DB */}
          {this.state.result.map(res => {
            return <li>{res.item}</li>;
          })}
        </ul>
      </View>
    );
  }

}

export default PrepareScreen;