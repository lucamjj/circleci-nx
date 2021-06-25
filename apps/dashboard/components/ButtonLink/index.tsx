import React, { forwardRef } from 'react';
import NextLink, { LinkProps } from 'next/link';
import { Button, ButtonProps } from '..';

const Link = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { children, ...rest } = props;
  return (
    <Button innerRef={ref} {...rest}>
      {children}
    </Button>
  );
});

export const ButtonLink = (
  props: ButtonProps | React.PropsWithChildren<LinkProps>
) => {
  const { children, href, ...rest } = props;
  return (
    <NextLink href={href} passHref>
      <Link {...rest}>{children}</Link>
    </NextLink>
  );
};

export const ExternalButtonLink = (props: ButtonProps) => {
  const { children, href, ...rest } = props;
  return (
    <Button href={href} {...rest}>
      {children}
    </Button>
  );
};

export default ButtonLink;
