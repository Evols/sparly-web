
import React, { ButtonHTMLAttributes } from 'react';

import  './Button.css';

interface IProps {
  children?: React.ReactNode;
  onClick?: () => void;
  btnProps?: ButtonHTMLAttributes<HTMLButtonElement>;
};

export function Button({ children, onClick, btnProps }: IProps) {
  return (
    <div className="button-container">
      <button className="button-button" type="button" onClick={() => onClick && onClick()} {...btnProps}>
        {children}
      </button>
    </div>
  );
}
