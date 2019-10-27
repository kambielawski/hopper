import React from 'react';

export const AddLocation = (location) => {
  return {
    type: 'addLocation',
    payload: { location },
  };
}

export const AddStartTime = time => {
  return {
    type: 'addStartTime',
    payload: { time },
  };
}

export const AddNumber = number => {
  return {
    type: 'addPhoneNumber',
    payload: { number },
  };
}