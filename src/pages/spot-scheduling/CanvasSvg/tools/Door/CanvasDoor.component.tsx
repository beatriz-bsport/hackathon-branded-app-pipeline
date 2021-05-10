import React from 'react';
import CanvasBaseComponent from '../BaseClasses/Base.component';

export interface CanvasDoorProps {
  x: number;
  y: number;
  rotation: number;
  stroke: string;
  fill: string;
}

export default class CanvasDoorComponent extends CanvasBaseComponent<CanvasDoorProps> {
  static zIndex = 99;

  static getTransform(x: number, y: number, rotation: number) {
    return `translate(${x} ${y}) rotate(${rotation} ${70 / 2} ${65 / 2})`;
  }

  render() {
    const { x, y, rotation, stroke } = this.props;

    return (
      <g
        {...this.BaseProps}
        transform={CanvasDoorComponent.getTransform(
          x === undefined ? -100 : x,
          y === undefined ? -100 : y,
          rotation || 0,
        )}
      >
        <polyline
          points="20,15 20,50"
          stroke={stroke || 'black'}
          fill={stroke || 'black'}
          strokeWidth={5}
          strokeLinecap="round"
        />

        <path
          stroke={stroke || 'black'}
          fill={stroke || 'black'}
          d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
          strokeLinecap="round"
          transform="translate(25 15) scale(1.5)"
        />

        <rect
          visibility="visible"
          width={70}
          height={65}
          x={0}
          y={0}
          stroke="transparent"
          fill="transparent"
        />
      </g>
    );
  }
}
