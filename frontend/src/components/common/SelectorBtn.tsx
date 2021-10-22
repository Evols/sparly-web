
import React from 'react';

import 'components/main/vivify.min.css';
import './SelectorBtn.css';

interface IProps {
  selected: boolean;
  onClick?: () => void,
  children: React.ReactNode,
  width?: number | string,
  square?: boolean,
  variant?: 'classic' | 'shadow',
};

export function SelectorBtn({ selected, onClick, width, children, square, variant }: IProps) {
  const actualWidth = width ?? 100;
  let divClasses = '';
  let pClasses = '';
  switch (variant) {
    case 'classic':
      ;
      break;
    case 'shadow':
      ;
      break;
  }
  return <div className={`${selected ? 'selector-btn-selected vivify pulsate duration-400' : ''}`} style={{ width: actualWidth, height: square ? actualWidth : undefined }}>
    <p className="history-selector-p" onClick={() => onClick && onClick()}>{children}</p>
  </div>
};
