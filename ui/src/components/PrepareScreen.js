import React, { Component } from 'react';
import { View, Button } from 'react-native';
import { Header, SearchBar } from 'react-native-elements';

class PrepareScreen extends Component {
  state = {
    search: '',
  };

  updateSearch = search => {
    this.setState({ search });
  };

  render() {
    const { search } = this.state;
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
        <SearchBar
          placeholder="Type Here..."
          onChangeText={this.updateSearch}
          value={search}
        />
        <Button
          title="Search"
          color="red"
			  />
      </View>
    );
  }
}

export default PrepareScreen;