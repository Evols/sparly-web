
import React from 'react';

interface IProps {
  text: string;
}

export function LoadingPlaceholder({ text }: IProps) {
  return (
    <div style={{ paddingTop: '20vh', textAlign: 'center', color: '#D0D0D0' }}>{text}</div>
  );
}
