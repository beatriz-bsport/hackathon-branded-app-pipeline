import React from 'react';
import CanvasBaseComponent from '../BaseClasses/Base.component';

export interface CanvasRectProps {
  x: number;
  y: number;
  width: number;
  height: number;
  stroke?: string;
  fill?: string;
  rotation?: number;
}

export default class CanvasRectComponent extends CanvasBaseComponent<CanvasRectProps> {
  render() {
    const { x, y, width, height, stroke, fill, rotation } = this.props;

    return (
      <rect
        {...this.BaseProps}
        className="svg-element"
        data-rotation={rotation || 0}
        fill={fill || 'transparent'}
        height={height || 0}
        stroke={stroke || 'black'}
        strokeWidth={2}
        transform={
          rotation && `rotate(${rotation} ${x + width / 2} ${y + height / 2})`
        }
        width={width || 0}
        x={x || 0}
        y={y || 0}
      />
    );
  }
}
