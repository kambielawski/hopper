import React, { Component } from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

<<<<<<< Updated upstream
import reducers from './src/reducers';
import {
  HomeScreen,
  PrepareScreen,
  SafetyScreen
} from './components';
=======
export default function App() {
  return (
    <View style={styles.container}>
      <Text>Marcus is da best!</Text>
    </View>
  );
}
>>>>>>> Stashed changes

const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen,
  },
  Prepare: {
    screen: PrepareScreen,
  },
  Safety: {
    screen: SafetyScreen,
  }
}, 
{
  initialRouteName: Home
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
