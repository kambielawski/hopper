import React, { Component } from 'react';
import { View, Button } from 'react-native';
import { Header, SearchBar, Icon, Input } from 'react-native-elements';

class PrepareScreen extends Component {
  state = {
    search: '',
  };

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

  render() {
    const { search } = this.state;
    return(
      <View style={{marginTop:16}}>
        <Header 
          placement="center"
          statusBarProps={{ barStyle: 'light-content' }}
          barStyle="light-content"
          centerComponent={{ text: 'Spice Up The Night', style: { fontSize: 22, fontWeight: 'bold', color: '#fff' } } }
          containerStyle={{
            backgroundColor: '#3D6DCC',
            justifyContent: 'space-around',
          }}
        />
        <View style={{marginTop:10, flexDirection:"row"}}>
          <Input 
            placeholder="Search..."
            containerStyle={{width:300}}
            // rightIcon={
            //   <Icon
            //     raised
            //     size={17}
            //     name="search"
            //   />
            // }
          />
          <Icon
            raised
            justifyContent="flex-end"
            size={18}
            name="search"
          />
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
      </View>
    );
  }
}

export default PrepareScreen;