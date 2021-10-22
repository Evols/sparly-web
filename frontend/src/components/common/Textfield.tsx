
import React from 'react';

import './Textfield.css';
import 'components/main/vivify.min.css';

interface IProps {
  placeholder?: string;
  value?: string;
  onChange?: (x: string) => void;
  width?: number | string;
  inputProps?: any;
  variant?: 'outlined' | 'standard';
};

export function Textfield({ value, onChange, placeholder, width, inputProps, variant }: IProps) {
  if (variant === 'outlined') {
    return (
      <div className="textfield-outlined-container" style={{ width: width }}>
        <input className="textfield-outlined-input"type="text" placeholder={placeholder} onFocus={() => {}} value={value} onChange={e => onChange && onChange(e.target.value)} {...inputProps} />
      </div>
    );
  }
  return <div>
    <div className="textfield-container" style={{ width: width }}>
    <input className="textfield-input" placeholder={placeholder} onFocus={() => {}} value={value} onChange={e => onChange && onChange(e.target.value)} {...inputProps} />
  </div>
  </div>;
};
