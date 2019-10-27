import React from 'react';
import { Button } from 'react-native';

const GetLocation = props => {
    return (
        <Button title="Get my location!" onPress={props.onmyLocation}/>
    );
};

export default GetLocation;