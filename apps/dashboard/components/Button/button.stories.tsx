import React from 'react';
import Button from './';

export default {
  component: Button,
  title: 'Button',
};

export const primary = () => {
  return <Button variant="contained">I am a button!</Button>;
};
