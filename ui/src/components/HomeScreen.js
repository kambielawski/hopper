import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Button } from 'react-native-elements';

class HomeScreen extends Component {

  static navigationOptions = {
    title: "Home"
  }

  render() {
    return(
      <View style={styles.viewStyle}>
        <Button 
          title="Plan your night out!"
          onPress={() => this.props.navigation.navigate('Location')}
        />
      </View>
    );
  }
}

const styles = {
  viewStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
}

export default HomeScreen;