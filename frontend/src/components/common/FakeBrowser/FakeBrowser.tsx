import type {
  FC,
  ReactNode,
} from 'react';

import React from 'react';

import NavBar from './NavBar';

type Props = {
  currentAddress: string;
  children: ReactNode;
};

const FakeBrowser: FC<Props> = ({
  currentAddress,
  children,
}) => (
  <>
    <NavBar
      currentAddress={currentAddress}
    />

    {children}
  </>
);

export default FakeBrowser;
