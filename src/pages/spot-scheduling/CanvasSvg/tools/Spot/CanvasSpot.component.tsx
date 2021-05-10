import React from 'react';
import CanvasBaseComponent from '../BaseClasses/Base.component';

export interface CanvasSpotProps {
  x: number;
  y: number;
  rotation?: number;
  index: number;
}

// TODO change the images
export default class CanvasSpotComponent extends CanvasBaseComponent<CanvasSpotProps> {
  static zIndex = 99;

  static getTransform(x: number, y: number, rotation: number) {
    return `translate(${x} ${y}) rotate(${rotation} ${62 / 2} ${62 / 2})`;
  }

  render() {
    const { x, y, rotation, index } = this.props;

    return (
      <g
        {...this.BaseProps}
        transform={CanvasSpotComponent.getTransform(
          x === undefined ? -100 : x,
          y === undefined ? -100 : y,
          rotation || 0,
        )}
      >
        <image
          x={1}
          y={1}
          href="https://upload.wikimedia.org/wikipedia/commons/a/a0/Circle_-_black_simple.svg"
          width={60}
          height={60}
        />

        <rect
          x={62 / 2 - (index > 9 ? 20 : 15) / 2}
          y={62 / 2 - 15 / 2}
          width={index > 9 ? 20 : 15}
          height={15}
          fill="white"
        />

        <text
          x={62 / 2}
          y={62 / 2}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {index}
        </text>

        <rect
          visibility="visible"
          width={62}
          height={62}
          x={0}
          y={0}
          stroke="transparent"
          fill="transparent"
        />
      </g>
    );
  }
}
