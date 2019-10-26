import React from 'react';

const INITIAL_STATE = {
  'phoneNumber': '',
}

export default (state=INITIAL_STATE, action) => {
  switch(action.type) {
    case "update_textfield":
      return state;
    default:
      return state;
  }
}