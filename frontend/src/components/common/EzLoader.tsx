
import React, { useEffect } from 'react';

interface IItemProps {
  load: () => void,
  children?: React.ReactNode,
};

export function EzLoader({ load, children }: IItemProps) {
  useEffect(() => load(), []);
  return <>{children}</>;
};
