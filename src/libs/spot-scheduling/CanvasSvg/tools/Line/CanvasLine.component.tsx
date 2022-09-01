import React from 'react';
import CanvasBaseComponent from '../BaseClasses/Base.component';

export interface CanvasLineProps {
  points: Array<Array<number>>;
  stroke?: string;
  fill?: string;
}

export default class CanvasLineComponent extends CanvasBaseComponent<CanvasLineProps> {
  get pointsStr() {
    let points = '';

    this.props.points &&
      this.props.points.forEach((p) => {
        points += `${p[0]},${p[1]} `;
      });

    return points;
  }

  render() {
    const { stroke, fill } = this.props;

    return (
      <polyline
        {...this.BaseProps}
        className="svg-element"
        points={this.pointsStr}
        stroke={stroke || 'black'}
        fill={fill || 'transparent'}
        strokeWidth={2}
      />
    );
  }
}
