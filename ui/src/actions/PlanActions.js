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