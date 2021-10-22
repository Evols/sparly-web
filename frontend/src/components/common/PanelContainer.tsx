
import React, { HTMLProps } from 'react';

import './PanelContainer.css';
import '../main/vivify.min.css';
import PlusIcon from '../../images/icons/plus-icon.svg';

interface IProps {
  children?: React.ReactNode,
  // If this is undefined, the plus icon is hidden. If not, it's visible
  plusIconSettings?: {
    isCross: boolean,
    onClicked?: () => void,
  },
  noVivify?: boolean,
};

export function PanelContainer({ children, plusIconSettings, noVivify, ...divProps }: IProps & HTMLProps<HTMLDivElement>) {

  const onPlusClicked = plusIconSettings && plusIconSettings.onClicked;
  const isCross = plusIconSettings && plusIconSettings.isCross;
  const plusIconStyle = {
    transform: `rotate(${isCross ? '45' : '90' }deg)`,
    transition: 'all 0.5s ease 0s',
  };
  const plusIconBtn = (
    <button className="panel-container-add-button" type="button" onClick={() => onPlusClicked && onPlusClicked()} style={plusIconStyle}>
      <img className={`panel-container-add-button-plus ${isCross ? 'spinIn' : 'spin'}`} src={PlusIcon} alt="Clover add icon" draggable="false" />
    </button>
  );

  return (
    <div {...divProps}>
      <div className="panel-container">
        <div className="panel-container-sub">
          <div className={`panel-container-inner ${!noVivify ? 'vivify pulsate' : ''}`}>
            { plusIconSettings !== undefined ? plusIconBtn : <React.Fragment />}
            { children ?? <React.Fragment /> }
          </div>
        </div>
      </div>
    </div>
  );
};
