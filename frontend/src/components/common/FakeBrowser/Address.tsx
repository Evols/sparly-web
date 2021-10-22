import React, {
  useState,
  useCallback,
  useEffect,
} from 'react';
import type {
  FC,
  SyntheticEvent,
} from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { definition as faAngleRight } from '@fortawesome/free-solid-svg-icons/faAngleRight';
import styled from 'styled-components';

export const StyledForm = styled.form({
  flex: 1,
  marginLeft: 5,
  marginRight: 5,
  position: 'relative',
});

export const StyledButton = styled.button({
  position: 'absolute',
  top: 0,
  right: 0,
  padding: 0,
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  width: 24,
  height: 24,
  borderRadius: 12,
  outline: 'none',
  color: '#333',

  ':hover': {
    backgroundColor: '#ddd',
  },

  ':active': {
    backgroundColor: '#d0d0d0',
  },
});

export const StyledInput = styled.input({
  boxSizing: 'border-box',
  outline: 'none',
  width: '100%',
  height: 24,
  borderRadius: 12,
  border: 'none',
  paddingLeft: 12,
  paddingRight: 40,
});

type Props = {
  currentAddress: string;
};

const Address: FC<Props> = ({
  currentAddress,
}) => {
  const isSameAddresses = false;

  const onChange = useCallback((event: SyntheticEvent): void => {
  }, []);

  const onSubmit = (event: SyntheticEvent): void => {
    event.preventDefault();
  };

  useEffect(() => {
    if (!isSameAddresses) {
    }
  }, [currentAddress]);

  return (
    <StyledForm
      onSubmit={onSubmit}
    >
      <StyledInput
        type="text"
        value={currentAddress}
        onChange={onChange}
        contentEditable={false}
        readOnly={true}
      />
    </StyledForm>
  );
};

export default Address;
