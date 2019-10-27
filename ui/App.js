import React, { Component } from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { Button, StyleSheet, Text, View } from 'react-native';
import { Stitch, AnonymousCredential } from 'mongodb-stitch-react-native-sdk';

import reducers from './src/reducers';
import HomeScreen from './src/components/HomeScreen';
import PrepareScreen from './src/components/PrepareScreen';
import SafetyScreen from './src/components/SafetyScreen';
import LocationScreen from './src/components/LocationScreen';
import AddTimeScreen from './src/components/AddTimeScreen';
import AddFriendsScreen from './src/components/AddFriendsScreen';
import FinishScreen from './src/components/FinishScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Location: LocationScreen,
  Time: AddTimeScreen,
  AddFriends: AddFriendsScreen,
  Finish: FinishScreen,
});

const AppNavigator = createBottomTabNavigator({
  Prepare: PrepareScreen,
  Home: HomeStack,
  Safety: SafetyScreen,
});

const AppContainer = createAppContainer(AppNavigator);

class App extends Component {

  constructor(props) {
    super(props);
    this.state={
      currentUserId: undefined,
      client: undefined
    };
    this._loadClient = this._loadClient.bind(this);
    this._onPressLogin = this._onPressLogin.bind(this);
    this._onPressLogout = this._onPressLogout.bind(this);
  }
 
  componentDidMount() {
    this._loadClient();
  }

 
  _loadClient() {
    Stitch.initializeDefaultAppClient('hopper-ylufi').then(client => {
      this.setState({ client });
 
      if(client.auth.isLoggedIn) {
        this.setState({ currentUserId: client.auth.user.id })
      }
    });
  }
 
  _onPressLogin() {
    this.state.client.auth.loginWithCredential(new AnonymousCredential()).then(user => {
        console.log(`Successfully logged in as user ${user.id}`);
        this.setState({ currentUserId: user.id })
    }).catch(err => {
        console.log(`Failed to log in anonymously: ${err}`);
        this.setState({ currentUserId: undefined })
    });
  }
 
  _onPressLogout() {
    this.state.client.auth.logout().then(user => {
        console.log(`Successfully logged out`);
        this.setState({ currentUserId: undefined })
    }).catch(err => {
        console.log(`Failed to log out: ${err}`);
        this.setState({ currentUserId: undefined })
    });
  }
  render() {
    const store = createStore(reducers);
    return(
      <Provider store={store}>
        <AppContainer />
      </Provider>
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
})

export default App;