import React from 'react';
import CanvasBaseComponent from '../BaseClasses/Base.component';

export interface CanvasScreenProps {
  x: number;
  y: number;
  rotation: number;
  stroke: string;
  fill: string;
  strokeWidth?: React.SVGAttributes<SVGPolylineElement>['strokeWidth'];
  strokeLinecap?: React.SVGAttributes<SVGPolylineElement>['strokeLinecap'];
}

export default class CanvasScreenComponent extends CanvasBaseComponent<CanvasScreenProps> {
  static zIndex = 99;

  static label = '';

  static getTransform(x: number, y: number, rotation: number) {
    return `translate(${x} ${y}) rotate(${rotation} ${130 / 2} ${65 / 2})`;
  }

  render() {
    const { x, y, rotation, stroke, fill, strokeWidth, strokeLinecap } =
      this.props;

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
          fill={fill || 'transparent'}
          points="15,20 115, 20"
          stroke={stroke || 'black'}
          strokeLinecap={strokeLinecap ?? 'round'}
          strokeWidth={strokeWidth ?? 15}
        />

        <rect
          fill="transparent"
          height={65}
          stroke="transparent"
          visibility="visible"
          width={130}
          x={0}
          y={0}
        />

        <text
          dominantBaseline="middle"
          style={{ userSelect: 'none' }}
          textAnchor="middle"
          x={130 / 2}
          y={50}
        >
          {CanvasScreenComponent.label}
        </text>
      </g>
    );
  }
}
