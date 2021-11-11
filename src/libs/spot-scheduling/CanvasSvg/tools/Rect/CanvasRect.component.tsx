import React from 'react';
import CanvasBaseComponent from '../BaseClasses/Base.component';

export interface CanvasRectProps {
  x: number;
  y: number;
  width: number;
  height: number;
  stroke?: string;
  fill?: string;
  strokeWidth?: number | string;
  rotation?: number;
}

export default class CanvasRectComponent extends CanvasBaseComponent<CanvasRectProps> {
  render() {
    const { x, y, width, height, stroke, fill, strokeWidth, rotation } =
      this.props;

    return (
      <rect
        {...this.BaseProps}
        className="svg-element"
        x={x || 0}
        y={y || 0}
        width={width || 0}
        height={height || 0}
        stroke={stroke || 'black'}
        fill={fill || 'transparent'}
        strokeWidth={strokeWidth || 2}
        data-rotation={rotation || 0}
        transform={
          rotation && `rotate(${rotation} ${x + width / 2} ${y + height / 2})`
        }
      />
    );
  }
}
