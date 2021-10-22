
import React, { HTMLProps } from 'react';
import { SizeMe } from 'react-sizeme';

import './Table.css';

export type TableLine = {
  th: (string | React.ReactNode)[];
  td: (string | React.ReactNode)[];
};

interface IProps {
  data: TableLine[],
  topIsWhite?: boolean,
  minCellWidth?: number,
  measuredWidth?: number,
  lineDataFilter?: (line: TableLine, cellCount: number, lineIdx: number) => TableLine,
  tableProps?: HTMLProps<HTMLTableElement>,
  tableRowProps?: (i: number) => HTMLProps<HTMLTableRowElement>,
  roundedLineIdx?: number;
}

function defaultLineDataFilter(line: TableLine, cellCount: number, lineIdx: number): TableLine {
  if (cellCount >= line.th.length + line.td.length) {
    return line;
  }
  if (cellCount >= line.th.length) {
    return {
      th: line.th,
      td: line.td.slice(0, cellCount - line.th.length),
    };
  }
  else {
    return {
      th: line.th.slice(0, cellCount),
      td: [],
    };
  }
}

export function Table({ data, topIsWhite, minCellWidth, lineDataFilter, tableProps, tableRowProps, roundedLineIdx, measuredWidth }: IProps) {

  const actualTopIsWhite = topIsWhite ?? false;
  const actualRoundedLineIdx = roundedLineIdx ?? 0;

  return (
      <table className="sheet-table" {...tableProps}>
        <tbody>
          {
            data.map(function(line, lineIdx) {
              let filteredLine = line;
              if (minCellWidth !== undefined && measuredWidth !== undefined) {
                const actualMaxCellCount = Math.floor(measuredWidth / minCellWidth);
                if (actualMaxCellCount < line.th.length + line.td.length) {
                  filteredLine = (lineDataFilter ?? defaultLineDataFilter)(line, actualMaxCellCount, lineIdx);
                }
              }
              return (
                <tr key={lineIdx} className={`sheet-table-tr`} {...(tableRowProps !== undefined ? tableRowProps(lineIdx) : {})}>
                  {
                    filteredLine.th.map((e, i) => (
                      <th
                        key={i}
                        className={`
                          sheet-table-th
                          ${lineIdx === actualRoundedLineIdx ? 'sheet-table-th-firstline' : ''}
                          ${lineIdx === data.length - 1 ? 'sheet-table-th-lastline' : ''}
                          ${(lineIdx === 0 ? !actualTopIsWhite : actualTopIsWhite) ? 'sheet-table-th-grey' : ''}
                        `}
                      >{e}</th>
                    ))
                  }
                  {
                    filteredLine.td.map((e, i) => (
                      <td
                        key={i}
                        className={`
                          sheet-table-td
                          ${lineIdx === actualRoundedLineIdx ? 'sheet-table-td-firstline' : ''}
                          ${lineIdx === data.length - 1 ? 'sheet-table-td-lastline' : ''}
                          ${(lineIdx === 0 ? !actualTopIsWhite : actualTopIsWhite) ? 'sheet-table-td-grey' : ''}
                        `}
                      >{e}</td>
                    ))
                  }
                </tr>
              )
            })
          }
        </tbody>
      </table>
  );
}
