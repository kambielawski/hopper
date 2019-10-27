import React from 'react';

const INITIAL_STATE = {
  locations: [],
  startTime: null,
  numbers: []
}

export default (state=INITIAL_STATE, action) => {
  switch(action.type) {
    case "addLocation":
      return { ...state, locations: [...state.locations, action.payload.location]};
    case "addStartTime": 
      return { ...state, startTime: action.payload.time };
    case "addPhoneNumber":
      console.log('payload', action.payload)
      return { ...state, numbers: [...state.numbers, action.payload.number]}
    default:
      return state;
  }
}