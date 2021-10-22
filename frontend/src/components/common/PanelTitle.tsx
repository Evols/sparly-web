
import React, { HTMLProps } from 'react';

import './PanelTitle.css';

interface IProps {
  title: string,
};

export function PanelTitle({ title }: IProps & HTMLProps<HTMLDivElement>) {
  return <h2 className="panel-container-inner-h2">{title}</h2>;
};
