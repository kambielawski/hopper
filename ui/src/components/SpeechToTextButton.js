import React, { Component } from 'react'
import {
  StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Platform,
} from 'react-native'
import { Audio, Permissions, FileSystem } from 'expo'
import axios from 'axios'

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#1e88e5',
    paddingVertical: 20,
    width: '90%',
    alignItems: 'center',
    borderRadius: 5,
    padding: 8,
    marginTop: 20,
  },
  text: {
    color: '#fff',
  }
})

const recordingOptions = {
    android: {
        extension: '.m4a',
        outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
        audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
        sampleRate: 44100,
        numberOfChannels: 1,
        bitRate: 128000,
    },
    ios: {
        extension: '.wav',
        audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
        sampleRate: 44100,
        numberOfChannels: 1,
        bitRate: 128000,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
    },
}

export default class SpeechToTextButton extends Component {
    constructor(props) {
        super(props)
        this.recording = null
        this.state = {
            isRecording: false,
            // we would like to know if data fetching is in progress
            isFetching: false,
            // we will write the transcript result here
            transcript: '',
        }
    }
    startRecording = async () => {
        // request permissions to record audio
        const {
            status
        } = await Permissions.askAsync(Permissions.AUDIO_RECORDING)
        // if the user doesn't allow us to do so - return as we can't do anything further :(
        if (status !== 'granted') return
        // when status is granted - setting up our state
        this.setState({
            isRecording: true
        })

        // basic settings before we start recording,
        // you can read more about each of them in expo documentation on Audio
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentModeIOS: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
            playThroughEarpieceAndroid: true,
        })
        const recording = new Audio.Recording()
        try {
            // here we pass our recording options
            await recording.prepareToRecordAsync(recordingOptions)
            // and finally start the record
            await recording.startAsync()
        } catch (error) {
            console.log(error)
            // we will take a closer look at stopRecording function further in this article
            this.stopRecording()
        }

        // if recording was successful we store the result in variable, 
        // so we can refer to it from other functions of our component
        this.recording = recording
    }

    stopRecording = async () => {
        // set our state to false, so the UI knows that we've stopped the recording
        this.setState({
            isRecording: false
        })
        try {
            // stop the recording
            await this.recording.stopAndUnloadAsync()
        } catch (error) {
            console.log(error)
        }
    }

    getTranscription = async () => {
        // set isFetching to true, so the UI knows about it
        this.setState({
            isFetching: true
        })
        try {
            // take the uri of the recorded audio from the file system
            const {
                uri
            } = await FileSystem.getInfoAsync(this.recording.getURI())
            // now we create formData which will be sent to our backend
            const formData = new FormData()
            formData.append('file', {
                uri,
                // as different audio types are used for android and ios - we should handle it
                type: Platform.OS === 'ios' ? 'audio/x-wav' : 'audio/m4a',
                name: Platform.OS === 'ios' ? `${Date.now()}.wav` : `${Date.now()}.m4a`,
            })
            // post the formData to our backend
            const {
                data
            } = await axios.post('<http://localhost:3005/speech>', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            // set transcript from the data which we received from the api
            this.setState({
                transcript: data.transcript
            })
        } catch (error) {
            console.log('There was an error reading file', error)
            this.stopRecording()
            // we will take a closer look at resetRecording function further down
            this.resetRecording()
        }
        // set isFetching to false so the UI can properly react on that
        this.setState({
            isFetching: false
        })
    }

    deleteRecordingFile = async () => {
        // deleting file
        try {
            const info = await FileSystem.getInfoAsync(this.recording.getURI())
            await FileSystem.deleteAsync(info.uri)
        } catch (error) {
            console.log('There was an error deleting recorded file', error)
        }
    }

    resetRecording = () => {
        this.deleteRecordingFile()
        this.recording = null
    }

    handleOnPressOut = () => {
        // first we stop the recording
        this.stopRecording()
        // second we interact with our backend
        this.getTranscription()
    }

    handler: async (request, h) => {
        // get the payload
        const data = request.payload;
        // check if file exists
        if (data.file) {
            const name = data.file.hapi.filename;
            const path = __dirname + "/uploads/" + name;
            // we will require this encodedPath later
            const encodedPath = __dirname + "/uploads/encoded_" + name;
            const file = fs.createWriteStream(path);
            file.on('error', (err) => console.error(err));
            data.file.pipe(file);
            return new Promise((resolve, reject) => {
                // when the file is saved on the serever we start to convert it
                data.file.on('end', async (err) => { 
                    // this params you probably would like to return to your app
                    const ret = {
                        filename: data.name,
                        headers: data.file.hapi.headers
                    }
                    // ffmpeg comes into action
                    // for detailed info on available options refer to ffmpeg documentation
                    ffmpeg()
                        .input(path)
                        .outputOptions([
                            '-f s16le',
                            '-acodec pcm_s16le',
                            '-vn',
                            '-ac 1',
                            '-ar 41k',
                            '-map_metadata -1'
                        ])
                        // here we save our result to the encodedPath we declared above
                        .save(encodedPath)
                        .on('end', async () => {
                            // after the file is saved we read it
                            const savedFile = await fs.readFile(encodedPath)
                            if (!savedFile) {
                            reject('file can not be read')
                            }
                            // we have to convert it to base64 in order to send to Google
                            const audioBytes = savedFile.toString('base64');
                            // this is also a requirement from google
                            const audio = {
                                content: audioBytes,
                            }
                            const sttConfig = {
                                // if you need punctuation set to true
                                enableAutomaticPunctuation: false,
                                encoding: "LINEAR16",
                                // same rate as we use in our ffmpeg options
                                sampleRateHertz: 41000,
                                languageCode: "en-US",
                                model: "default"
                            }
                            // building up the request object
                            const request = {
                                audio: audio,
                                config: sttConfig,
                            }

                            // now we finally pass it to the Google API and wait for the response
                            const [response] = await client.recognize(request);
                            if (!response) {
                            reject('no response')
                            }
                            // iterate through the words and join them to get a string
                            const transcript = response.results
                                .map(result => result.alternatives[0].transcript)
                                .join('\\n');
                            // removing audio files as we don't need them any more
                            fs.unlinkSync(path)
                            fs.unlinkSync(encodedPath)

                            // sending the response to our React Native application
                            resolve(JSON.stringify({...ret, transcript}))
                        })
                    })
                })
            }
        },

    render() {
        const {
            isRecording, transcript, isFetching,
        } = this.state
        return (
            <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPressIn={this.startRecording}
                onPressOut={this.handleOnPressOut}
            >
                {isFetching && <ActivityIndicator color="#ffffff" />}
                {!isFetching && 
                <Text style={styles.text}>
                    {isRecording ? 'Recording...' : 'Start recording'}
                </Text>
                }
            </TouchableOpacity>
            <Text>
                {transcript}
            </Text>
            </View>
        )
    }
};