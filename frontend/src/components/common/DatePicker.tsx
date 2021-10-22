
import React, { useEffect, useState } from 'react';

import CalendarIcon from 'images/icons/calendar-icon.svg';

import  './DatePicker.css';

import $ from 'jquery';
// @ts-ignore
import jqueryDatepicker from 'jquery-datepicker';
import { DateTime } from 'luxon';

jqueryDatepicker($);

interface IProps {
  value?: DateTime | null;
  onChange?: (v: DateTime) => void;
};

export function DatePicker({ value, onChange }: IProps) {

  const [idName, setIdName] = useState(null as (string | null));
  const [stateValue, setStateValue] = useState(null as (DateTime | null));
  const actualValue = value !== undefined ? value : stateValue;

  const pickerFormat = 'dd/mm/yy';
  const dateTimeFormat = 'dd/MM/yy';

  useEffect(() => {
    const id = `calendar-${Math.random() * 100000000000000000}`;
    setIdName(id);
  }, []);

  useEffect(() => {
    if (idName !== null) {
      // @ts-ignore
      $(`#${idName}`).datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: '-116:+34',
        dateFormat: pickerFormat,
        value: actualValue,
        onSelect: (dateText: string) => {
          const newValue = DateTime.fromFormat(dateText, dateTimeFormat);
          setStateValue(newValue);
          if (onChange !== undefined) {
            onChange(newValue);
          }
        },
      });
    }
  }, [idName]);

  return (
    <div className="datepicker-container">
      <img className="datepicker-img" src={CalendarIcon} alt="Clover Calendar icon" draggable="false" />
      &nbsp;<input type="text" id={idName ?? undefined} className="datepicker-input" readOnly={true} placeholder="Date" />
    </div>
  );
}
