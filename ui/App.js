import React, { Component } from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { StyleSheet, Text, View } from 'react-native';

import reducers from './src/reducers';

const AppNavigator = createStackNavigator({
  Home: {
    screen: Home,
  },

});

const AppContainer = createAppContainer(AppNavigator);

class App extends Component {
  render() {
    const store = createStore(reducers);
    return(
      <Provider store={store}>
      </Provider>
    );
  }
}
