
import React from 'react';

interface IProps {
  children?: React.ReactNode,
  blurred: boolean,
};

export function Blurrable({ children, blurred }: IProps) {
  return <div style={{ filter: blurred ? 'blur(3px)' : 'blur(0px)', opacity: blurred ? 0.15 : 1.0, transition: 'all 1s ease 0s' }}>{children}</div>;
}
