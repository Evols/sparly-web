import type { FC } from 'react';
import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { definition as faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { definition as faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { definition as faRedo } from '@fortawesome/free-solid-svg-icons/faRedo';
import { faTimes, faWindowMinimize, faWindowRestore } from '@fortawesome/free-solid-svg-icons';

import Button from './Button';
import Address from './Address';

const StyledNavBar = styled.div({
  display: 'flex',
  padding: 5,
  backgroundColor: '#f6f6f6',
});

type Props = {
  currentAddress: string;
};

const NavBar: FC<Props> = ({
  currentAddress,
}) => (
  <StyledNavBar>

    <div style={{ width: '100%' }}>

      <div style={{ textAlign: 'right', marginTop: '-4px' }}>

        <Button
          type="button"
          disabled={true}
        >
          <FontAwesomeIcon
            icon={faWindowMinimize}
            size="xs"
          />
        </Button>

        <Button
          type="button"
          disabled={true}
        >
          <FontAwesomeIcon
            icon={faWindowRestore}
            size="xs"
          />
        </Button>

        <Button
          type="button"
          disabled={true}
        >
          <FontAwesomeIcon
            icon={faTimes}
            size="xs"
          />
        </Button>

      </div>

      <div style={{ width: '100%', display: 'flex', }}>

        <Button
          type="button"
          disabled={true}
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
          />
        </Button>

        <Button
          type="button"
          disabled={true}
        >
          <FontAwesomeIcon
            icon={faArrowRight}
          />
        </Button>

        <Button
          type="button"
          disabled={true}
        >
          <FontAwesomeIcon
            icon={faRedo}
          />
        </Button>

        <Address
          currentAddress={currentAddress}
        />

      </div>

    </div>

  </StyledNavBar>
);

export default NavBar;
