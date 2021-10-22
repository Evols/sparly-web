
import React, { useRef } from 'react';
import { SizeMe } from 'react-sizeme';

interface IProps {
  children?: undefined;
  generator: (width: number, height: number) => React.ReactNode,
  paddingX: number,
  paddingY: number,
};

export function GraphContainer({ generator, paddingX, paddingY }: IProps) {

  const refHolder = useRef({ width: 0, height: 0, key: Math.random() } as any);

  return (
    <SizeMe monitorHeight={true} monitorWidth={true}>
    {({ size }) => {

      if ((!size.width && size.width !== 0) || (!size.height && size.height !== 0)) {
        return <div></div>;
      }

      if (refHolder.current.width !== size.width || refHolder.current.height !== size.height) {
        refHolder.current.width = size.width;
        refHolder.current.height = size.height;
        refHolder.current.key = Math.random();
      }

      return (
        <div style={{
          height: '100%',
          width: '100%',
          display: 'flex',
        }}>
          <div style={{ flex: 1, flexGrow: 1 }} />
          <div style={{ width: size.width - paddingX, height: size.height - paddingY }} key={refHolder.current.key}>
            { generator(size.width - paddingX, size.height - paddingY) }
          </div>
          <div style={{ flex: 1, flexGrow: 1 }} />
        </div>
      );

    }}
    </SizeMe>
  );
};
