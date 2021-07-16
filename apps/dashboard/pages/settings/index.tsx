import React from 'react';
import ButtonLink from '../../components/ButtonLink';

const Settings = () => {
  return (
    <ButtonLink
      href={'/settings/templates/new'}
      style={{
        width: '100%',
      }}
    >
      Edit/Add Templates
    </ButtonLink>
  );
};

export default Settings;
