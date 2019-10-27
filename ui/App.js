import React, { Component } from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

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
  render() {
    const store = createStore(reducers);
    return(
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}

export default App;