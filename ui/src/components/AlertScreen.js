import React from 'react';
import { StyleSheet,Text, View, Button, Alert } from 'react-native';
import { CheckBox } from 'react-native-elements';

class AlertScreen extends React.Component {
    state={
        checked:false
    }
    onPressEvent(){
        Alert.alert('You clicked button')
    }

    render() {
        return(
            <View style={{flex:1, marginTop:150}}>
                <CheckBox
                    left
                    title='Allow Hopper to access your location?'
                    checked={this.state.checked}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: 'center',
        justifyContent: 'center',
    },
});


export default AlertScreen;