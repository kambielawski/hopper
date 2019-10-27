import React, { Component } from 'react';
<<<<<<< HEAD
import { View, Button, TextInput, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { Header, SearchBar } from 'react-native-elements';
=======
import { View, TextInput, Text, FlatList, SafeAreaView } from 'react-native';
import { Header, SearchBar, Icon, Input, Button, PricingCard } from 'react-native-elements';
>>>>>>> dbe8d86954e5835ec49d417646c07eb023960fde
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
<<<<<<< HEAD
      res: [],
=======
      res: []
>>>>>>> dbe8d86954e5835ec49d417646c07eb023960fde
    };
    this._loadClient = this._loadClient.bind(this);
    this._onPressSubmit = this._onPressSubmit.bind(this);
  }

  componentDidMount() {
    this._loadClient();
  }

  _loadClient() {
    Stitch.initializeDefaultAppClient('hopper-ylufi').then(client => {
      this.setState({
        client
      });
      client.auth.loginWithCredential(new AnonymousCredential()).then(user => {
        console.log(`Successfully logged in as user ${user.id}`);
<<<<<<< HEAD
        this.setState({ currentUserId: user.id })
      }).catch(err => {
        console.log(`Failed to log in anonymously: ${err}`);
        this.setState({ currentUserId: undefined })
      });
      const dbClient = client.getServiceClient(MongoDB.RemoteMongoClient.factory, "mongodb-atlas");
      this.setState({ atlasClient: dbClient });
      this.setState({ myData: dbClient.db("MyData") });
=======
        this.setState({
          currentUserId: user.id
        })
      }).catch(err => {
        console.log(`Failed to log in anonymously: ${err}`);
        this.setState({
          currentUserId: undefined
        })
      });
      const dbClient = client.getServiceClient(MongoDB.RemoteMongoClient.factory, "mongodb-atlas");
      this.setState({
        atlasClient: dbClient
      });
      this.setState({
        myData: dbClient.db("MyData")
      });
>>>>>>> dbe8d86954e5835ec49d417646c07eb023960fde
    });

  }

  getImageURI = async (i) => {
    let pics = await fetch(`https://pixabay.com/api/?key=14077809-0fb00ab558b80f5a4594810cc&q=${i.item.CATEGORY_NAME}&image_type=photo`);
    const obj = await pics.json();
    const preview = obj.hits[i.index].previewURL;

    return preview;
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
<<<<<<< HEAD
        return items
      })
      .catch(err => console.error(`Failed to find documents: ${err}`))
  };

  renderItem = i => {
    console.log(i);
    return (
      <View>
        <View style={styles.itemBoxStyle}>
          <Image style={{width: 50, height: 50}} source={{uri: this.getImageURI(i)}} />
          <Text style={{ ...styles.itemTextStyle, fontWeight: 'bold' }}>{i.item.DISPLAY_NAME}</Text>
          <Text style={styles.itemTextStyle}>{i.item.BRAND_NAME}</Text>
          <Text style={styles.itemTextStyle}>{i.item.LIST_PRICE}</Text>
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
            title="Search"
            color="red"
            onPress={() => this._onPressSubmit().then(stuff => this.setState({ res: stuff }))}
          />
        </View>
        <View>
          <FlatList
            data={this.state.res}
            renderItem={i => this.renderItem(i)}
            keyExtractor={i => i.index}
          />
=======
        // items.forEach(console.log)
        this.setState({res : items})
        return this.res
      })
      .catch(err => console.error(`Failed to find documents: ${err}`))
  //   let returnVal = collection.find(query, projection)
  //     .toArray()
  //     .then(items => {
  //       console.log(`Successfully found ${items.length} documents.`)
  //       items.forEach(console.log)
  //       return items
  //     })
  //     .catch(err => console.error(`Failed to find documents: ${err}`))
  //   this.setState({ res: returnVal });
  //   console.log(res);
  }

  updateSearch = search => {
    this.setState({ search });
  };

  startRecording = async () => {
    const {
      status
    } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    if (status !== 'granted') return;

    this.setState({
      isRecording: true
    });
    // some of these are not applicable, but are required
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: true,

    });
    const recording = new Audio.Recording();
    try {
      await recording.prepareToRecordAsync(recordingOptions);
      await recording.startAsync();
    } catch (error) {
      console.log(error);
      this.stopRecording();
    }
    this.recording = recording;
  }

  getTranscription = async () => {
    this.setState({
      isFetching: true
    });
    try {
      const info = await FileSystem.getInfoAsync(this.recording.getURI());
      console.log(`FILE INFO: ${JSON.stringify(info)}`);
      const uri = info.uri;
      const formData = new FormData();
      formData.append('file', {
        uri,
        type: 'audio/x-wav',
        // could be anything 
        name: 'speech2text'
      });
      const response = await fetch(config.CLOUD_FUNCTION_URL, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      this.setState({
        query: data.transcript
      });
    } catch (error) {
      console.log('There was an error', error);
      this.stopRecording();
      this.resetRecording();
    }
    this.setState({
      isFetching: false
    });
  }

  isPopulated = () => {
    if(this.state.res !== []) {
    }
    return null
  }

  renderItem = (item) => {
    console.log(item)
    return;
  }

  render() {
    const { search } = this.state;
    return(
      <View >
        <Header
          placement="center"
          statusBarProps={{ barStyle: "dark-content" }}
          barStyle="dark-content"
          leftComponent={<Icon
            name="arrow-back"
          />}
          centerComponent={{ text: 'Spice Up The Night', style: { fontSize: 22, fontWeight: 'bold', color: '#fff' } } }
          containerStyle={{
            justifyContent: 'space-around',
            backgroundColor: '#3f6bd9'
          }}
        />
        <View style={{marginTop:10, flexDirection:"row", marginLeft:3}}>
          <Input 
            placeholder="Type Here..."
            onChangeText={(text) => this.setState({search: text})}
            containerStyle={{width:250}}
          />
          <Button
            raised
            icon={<Icon
              name="search"
              size={18}
              color="white"
            />}
            iconRight
            title="Search "
            backgroundColor="#3f6bd9"
            onPress={() => this._onPressSubmit()}
			    />
          {/* <PricingCard
            color="#4f9deb"
            title="Free"
            price="$0"
            info={this.state.res}
            // button={{ title: 'GET STARTED', icon: 'flight-takeoff' }}
          /> */}
          
        </View>

          {/* <Text>{JSON.parse(item.BRAND_NAME)}</Text> */}
        <View> {
            <FlatList
                data={this.state.res}
                renderItem={item => this.renderItem(item.item)}
              />
        }
        </View>
          
        
        
        <Icon
          raised
          placement="right"
          name="keyboard-voice"
          type='material-icons'
          color="black"
          size={30}
          containerStyle={{marginLeft: 270, marginTop: 350}}
        />

        <View>

>>>>>>> dbe8d86954e5835ec49d417646c07eb023960fde
        </View>
      </View>
    );
  }
  
  
}

const styles = {
  itemBoxStyle: {
    backgroundColor: 'blue',
    flex: 1,
    flexDirection: 'col',
    borderRadius: 2,
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
  },
  itemTextStyle: {
    color: 'white',
    fontSize: 16,
    paddingTop: 4,
    paddingBottom: 4,
  }
}

export default PrepareScreen;