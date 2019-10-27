import React from 'react';

const INITIAL_STATE = {
  locations: [],
  startTime: null,
  endTime: null,
}

export default (state=INITIAL_STATE, action) => {
  switch(action.type) {
    case "addLocation":
      return { ...state, locations: [...state.locations, action.payload.location]};
    case "addStartTime": 
      return { ...state, timeStart: action.payload };
    default:
      return state;
  }
}