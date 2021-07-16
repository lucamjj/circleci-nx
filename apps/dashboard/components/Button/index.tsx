import React from 'react';
import {
  Button as MaterialButton,
  ButtonProps as MaterialButtonProps,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core';

type marginProps = {
  margin?: string;
  marginLeft?: string;
  marginRight?: string;
  marginBottom?: string;
  marginTop?: string;
};

type ButtonProps = MaterialButtonProps & marginProps;

const useStyles = makeStyles(() => ({
  root: {
    margin: (props: ButtonProps) => props.margin,
    marginLeft: (props: ButtonProps) => props.marginLeft,
    marginRight: (props: ButtonProps) => props.marginRight,
    marginBottom: (props: ButtonProps) => props.marginBottom,
    marginTop: (props: ButtonProps) => props.marginTop,
  },
}));

export const Button = (props: ButtonProps) => {
  const classes = useStyles(props);

  return (
    <MaterialButton {...props} className={classes.root}>
      {props.children}
    </MaterialButton>
  );
};

export default Button;
