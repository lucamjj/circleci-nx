import React from 'react';
import { ButtonLink } from '.';

export default {
  component: ButtonLink,
  title: 'ButtonLink',
};

export const primary = () => {
  return (
    <ButtonLink variant="contained" href="https://www.google.com/">
      I am a button link! Visit Google's homepage
    </ButtonLink>
  );
};
