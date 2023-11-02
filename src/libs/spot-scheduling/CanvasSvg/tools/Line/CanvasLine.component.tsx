import React from 'react';
import CanvasBaseComponent from '../BaseClasses/Base.component';

export interface CanvasLineProps {
  points: Array<Array<number>>;
  stroke?: string;
  fill?: string;
  strokeWidth?: React.SVGAttributes<SVGPolylineElement>['strokeWidth'];
  strokeLinecap?: React.SVGAttributes<SVGPolylineElement>['strokeLinecap'];
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
    const { stroke, fill, strokeWidth, strokeLinecap } = this.props;

    return (
      <polyline
        {...this.BaseProps}
        className="svg-element"
        fill={fill || 'transparent'}
        points={this.pointsStr}
        stroke={stroke || 'black'}
        strokeWidth={strokeWidth ?? 2}
        {...(strokeLinecap ? { strokeLinecap } : {})}
      />
    );
  }
}
