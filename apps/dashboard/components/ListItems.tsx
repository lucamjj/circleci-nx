import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ButtonLink from './ButtonLink';

export const mainListItems = (
  <div>
    <ListItem>
      <ButtonLink
        href={'/'}
        style={{
          width: '100%',
        }}
      >
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ButtonLink>
    </ListItem>
    <ListItem>
      <ButtonLink
        href={'/team'}
        style={{
          width: '100%',
        }}
      >
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Team" />
      </ButtonLink>
    </ListItem>
    <ListItem>
      <ButtonLink
        href={'/git'}
        style={{
          width: '100%',
        }}
      >
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Git" />
      </ButtonLink>
    </ListItem>
  </div>
);
