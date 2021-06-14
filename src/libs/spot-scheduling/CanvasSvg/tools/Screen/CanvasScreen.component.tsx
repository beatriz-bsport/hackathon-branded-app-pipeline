import React from 'react';
import CanvasBaseComponent from '../BaseClasses/Base.component';

export interface CanvasScreenProps {
  x: number;
  y: number;
  rotation: number;
  stroke: string;
  fill: string;
}

export default class CanvasScreenComponent extends CanvasBaseComponent<CanvasScreenProps> {
  static zIndex = 99;

  static label = '';

  static getTransform(x: number, y: number, rotation: number) {
    return `translate(${x} ${y}) rotate(${rotation} ${130 / 2} ${65 / 2})`;
  }

  render() {
    const { x, y, rotation, stroke, fill } = this.props;

    return (
      <g
        {...this.BaseProps}
        transform={CanvasScreenComponent.getTransform(
          x === undefined ? -9999 : x,
          y === undefined ? -9999 : y,
          rotation || 0,
        )}
      >
        <polyline
          {...this.BaseProps}
          points="15,20 115, 20"
          stroke={stroke || 'black'}
          fill={fill || 'transparent'}
          strokeWidth={15}
          strokeLinecap="round"
        />

        <rect
          visibility="visible"
          width={130}
          height={65}
          x={0}
          y={0}
          stroke="transparent"
          fill="transparent"
        />

        <text
          x={130 / 2}
          y={50}
          dominantBaseline="middle"
          textAnchor="middle"
          style={{ userSelect: 'none' }}
        >
          {CanvasScreenComponent.label}
        </text>
      </g>
    );
  }
}
