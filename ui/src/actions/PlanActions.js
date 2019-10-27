import React from 'react';

export const AddLocation = (location) => {
  return {
    type: 'addLocation',
    payload: { location },
  };
}