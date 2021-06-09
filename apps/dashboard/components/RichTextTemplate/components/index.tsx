import React, { Ref, PropsWithChildren } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '../../';
import FormatBold from '@material-ui/icons/FormatBold';
import FormatItalic from '@material-ui/icons/FormatItalic';
import FormatUnderlined from '@material-ui/icons/FormatUnderlined';
import Code from '@material-ui/icons/Code';
import LooksOne from '@material-ui/icons/LooksOne';
import LooksTwo from '@material-ui/icons/LooksTwo';
import FormatCode from '@material-ui/icons/FormatQuote';
import FormatListNumbered from '@material-ui/icons/FormatListNumbered';
import FormatListBulleted from '@material-ui/icons/FormatListBulleted';

const iconsMap = {
  formatBold: FormatBold,
  formatItalic: FormatItalic,
  formatUnderlined: FormatUnderlined,
  code: Code,
  looksOne: LooksOne,
  looksTwo: LooksTwo,
  formatCode: FormatCode,
  formatListNumbered: FormatListNumbered,
  formatListBulleted: FormatListBulleted,
};

const useStyles = makeStyles((theme) => ({
  button: {
    cursor: 'pointer',
    '& > span': {
      display: 'flex',
    },
  },
  toolbar: {
    position: 'relative',
    padding: '0',
    margin: '-16px -20px',
    borderBottom: '2px solid #eee',
    marginBottom: '20px',
  },
  menu: {
    '& > * ': {
      display: 'inline-block',
    },
    '& > * + * ': {
      marginLeft: '15px',
    },
  },
  icon: {
    fontSize: '18px',
    verticalAlign: 'text-bottom',
  },
}));

interface BaseProps {
  className: string;
  [key: string]: unknown;
}
type OrNull<T> = T | null;

export const RichTextButton = React.forwardRef(
  (
    {
      className,
      active,
      reversed,
      ...props
    }: PropsWithChildren<
      {
        active: boolean;
        reversed: boolean;
      } & BaseProps
    >,
    ref: Ref<OrNull<HTMLButtonElement>>
  ) => {
    const classes = useStyles();
    return (
      <Button
        {...props}
        ref={ref}
        className={`${className} ${classes.button}`}
        style={{
          color: reversed
            ? active
              ? 'white'
              : '#aaa'
            : active
            ? 'black'
            : '#ccc',
        }}
      ></Button>
    );
  }
);

export const Icon = (props: { iconName: string }) => {
  const CurrentIcon = iconsMap[props.iconName];
  return <CurrentIcon />;
};

export const Menu = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<OrNull<HTMLDivElement>>
  ) => {
    const classes = useStyles();
    return (
      <div {...props} ref={ref} className={`${className} ${classes.menu}`} />
    );
  }
);

export const Toolbar = React.forwardRef(
  (
    { className, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<OrNull<HTMLDivElement>>
  ) => {
    const classes = useStyles();
    return (
      <Menu
        {...props}
        ref={ref}
        className={`${className} ${classes.toolbar}`}
      />
    );
  }
);
