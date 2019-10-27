import React from 'react';

const INITIAL_STATE = {
  locations: [],
}

export default (state=INITIAL_STATE, action) => {
  switch(action.type) {
    case "addLocation":
      console.log(action.payload);
      return { ...state, locations: [...state.locations, action.payload.location]};
    default:
      console.log("???");
      return state;
  }
}