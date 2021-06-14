import React from 'react';
import CanvasBaseComponent from '../BaseClasses/Base.component';

export interface CanvasTeacherProps {
  x: number;
  y: number;
  rotation: number;
  stroke: string;
  fill: string;
}

export default class CanvasTeacherComponent extends CanvasBaseComponent<CanvasTeacherProps> {
  static zIndex = 99;

  static label = '';

  static getTransform(x: number, y: number, rotation: number) {
    return `translate(${x} ${y}) rotate(${rotation} ${31.5 / 2} ${35 / 2})`;
  }

  render() {
    const { x, y, rotation, stroke, fill } = this.props;

    return (
      <g
        {...this.BaseProps}
        transform={CanvasTeacherComponent.getTransform(
          x === undefined ? -9999 : x,
          y === undefined ? -9999 : y,
          rotation || 0,
        )}
      >
        <path
          d="M30.875 7.5C26.3075 8.725 20.9525 9.25 16 9.25C11.0475 9.25 5.6925 8.725 1.125 7.5L0.25 11C3.505 11.875 7.25 12.4525 10.75 12.75V35.5H14.25V25H17.75V35.5H21.25V12.75C24.75 12.4525 28.495 11.875 31.75 11L30.875 7.5ZM16 7.5C17.925 7.5 19.5 5.925 19.5 4C19.5 2.075 17.925 0.5 16 0.5C14.075 0.5 12.5 2.075 12.5 4C12.5 5.925 14.075 7.5 16 7.5Z"
          fill={fill || '#757575'}
          stroke={stroke || 'transparent'}
        />

        <rect
          visibility="visible"
          width={40 * 2}
          height={40 * 2}
          x={-50 / 2}
          y={-40 / 2}
          stroke="transparent"
          fill="transparent"
        />

        <text
          x={35 / 2}
          y={50}
          dominantBaseline="middle"
          textAnchor="middle"
          style={{ userSelect: 'none' }}
        >
          {CanvasTeacherComponent.label}
        </text>
      </g>
    );
  }
}
