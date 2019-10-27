import React, { Component } from 'react';
import {  Image, Text, View , AppRegistry,StyleSheet, TextInput, SafeAreaView } from 'react-native';
import { Card, ListItem,  Icon ,Button } from 'react-native-elements';
import QRCode from 'react-native-qrcode';

function Separator() {
  return <View style={styles.separator} />;
}

<<<<<<< HEAD
class HomeScreen extends Component {
  state = {
    text: 'http://facebook.github.io/react-native/',
  };
=======
  static navigationOptions = {
    title: "Home"
  }

>>>>>>> f9e0cc1a773003886ce92a7682e3cb2001b41cb1
  render() {
    return(
      <SafeAreaView style={styles.container}>

      <View style={styles.container}>
          <Text style={styles.titleText}> Have a good night, Harrison!</Text>
          
        <QRCode
          value={this.state.text}
          size={200}
          bgColor='blue'
          fgColor='white'/>

          <Card
            title='Your Activities'
            image={require('../images/bar2.jpg')}
            containerStyle= {{paddingHorizontal:100}}
            imageStyle={{minWidth:400, minHeight: 100}}
            wrapperStyle={{minWidth:100}}
            >
          
          </Card>
          </View>
          <Separator />
          <View>
        <Button 
          title="Plan your night out!"
          onPress={() => this.props.navigation.navigate('Location')}
        />
        
      </View>
      </SafeAreaView>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding:20,
    flexDirection:"column"
},
 
  titleText: {
    alignItems: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: .5,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

});


export default HomeScreen;