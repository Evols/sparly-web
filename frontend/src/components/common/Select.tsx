
import React, { HTMLProps, useRef, useState } from 'react';

import useOnClickOutside from 'use-onclickoutside';

import './Select.css';
import 'components/main/vivify.min.css';
import { Textfield } from './Textfield';

interface IProps<T> {
  placeholder?: string;
  valuesList: T[];
  valueToLabel: (x: T) => string;
  valueToDropdown?: (x: T) => React.ReactNode; // If valueToDropdown is undefined, valueToLabel is used as a fallback
  value?: T;
  onChange?: (x: T) => void;
  width?: number | string;
  selectorWidth?: number | string;
  variant?: 'outlined' | 'standard';
  containerProps?: HTMLProps<HTMLDivElement>,
};

export function Select<T>({ value, onChange, placeholder, width, selectorWidth, valuesList, valueToLabel, valueToDropdown, variant, containerProps }: IProps<T>) {

  const [isOpened, setIsOpened] = useState(false);
  const [stateValue, setStateValue] = useState(null as (T | null));

  const ref = useRef(undefined as any);
  useOnClickOutside(ref, () => setIsOpened(false));

  const actualValue = value !== undefined ? value : stateValue;

  const actualContainerProps = { ...containerProps, style: { width, ...containerProps?.style } };

  return <div className="select-container" {...actualContainerProps}>
    <Textfield
      variant={variant}
      width={width}
      placeholder={placeholder}
      inputProps={{
        onClick: () => setIsOpened(true),
        onFocus: () => {},
        style: {
          cursor: 'pointer',
        },
        readOnly: true,
      }}
      value={actualValue !== null ? valueToLabel(actualValue) : ''}
    />
    <div ref={ref} className="select-selector vivify pullDown duration-250" style={{ display: isOpened ? 'block' : 'none', width: selectorWidth ?? width }}>
      {
        valuesList.map(
          e => <div
            key={JSON.stringify(e)}
            className="select-selector-item"
            onClick={
              () => {
                setStateValue(e);
                onChange && onChange(e);
                setIsOpened(false);
              }
            }
          >
            { valueToDropdown !== undefined ? valueToDropdown(e) : valueToLabel(e) }
          </div>
        )
      }
    </div>
  </div>;
};
