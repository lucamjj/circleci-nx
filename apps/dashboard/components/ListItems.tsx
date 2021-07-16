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
    <ListItem>
      <ButtonLink
        href={'/okr'}
        style={{
          width: '100%',
        }}
      >
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="OKR" />
      </ButtonLink>
    </ListItem>
    <ListItem>
      <ButtonLink
        href={'/onboarding'}
        style={{
          width: '100%',
        }}
      >
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Onboarding" />
      </ButtonLink>
    </ListItem>
    <ListItem>
      <ButtonLink
        href={'/hiring'}
        style={{
          width: '100%',
        }}
      >
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Hiring" />
      </ButtonLink>
    </ListItem>
    <ListItem>
      <ButtonLink
        href={'/settings'}
        style={{
          width: '100%',
        }}
      >
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Settings" />
      </ButtonLink>
    </ListItem>
  </div>
);
