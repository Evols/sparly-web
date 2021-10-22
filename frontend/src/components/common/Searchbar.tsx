
import React from 'react';
import FocusIcon from '../../images/icons/focus-icon.svg';

import './Searchbar.css';

interface IProps {
  value?: string,
  onChange?: (v: string) => void,
  placeholder?: string,
  onFocus?: () => void,
};

export function Searchbar({ value, onChange, placeholder, onFocus }: IProps) {
  return (
    <div className="searchbar-container">
      <img className="searchbar-container-icon" src={FocusIcon} alt="Clover Focus icon" draggable="false" />
      <input
        className="searchbar-input"
        type="text"
        value={value}
        onChange={onChange !== undefined ? (event => onChange(event.target.value)) : undefined}
        placeholder={placeholder ?? 'Rechercher'}
        onFocus={onFocus}
      />
    </div>
  );
};
