import React from 'react';
import { Avatar } from '@material-ui/core';
import CanvasBaseComponent from '../BaseClasses/Base.component';

export interface CanvasTeacherProps {
  x: number;
  y: number;
  rotation: number;
  stroke: string;
  fill: string;
  coach?: any;
}

export default class CanvasTeacherComponent extends CanvasBaseComponent<CanvasTeacherProps> {
  static zIndex = 99;

  static label = '';

  static avatarSize = 80;

  static getTransform(x: number, y: number, rotation: number) {
    return `translate(${x} ${y}) rotate(${rotation} ${31.5 / 2} ${35 / 2})`;
  }

  render() {
    const { x, y, rotation } = this.props;

    return (
      <g
        {...this.BaseProps}
        transform={CanvasTeacherComponent.getTransform(
          x === undefined ? -9999 : x,
          y === undefined ? -9999 : y,
          rotation || 0,
        )}
      >
        <foreignObject
          x={-CanvasTeacherComponent.avatarSize / 2}
          width={CanvasTeacherComponent.avatarSize}
          height={CanvasTeacherComponent.avatarSize}
        >
          <Avatar
            src={this.props?.coach?.photo || ''}
            style={{ width: '100%', height: '100%' }}
          />
        </foreignObject>

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
          x={0}
          y={CanvasTeacherComponent.avatarSize + 15}
          dominantBaseline="middle"
          textAnchor="middle"
          style={{ userSelect: 'none' }}
        >
          {this.props?.coach?.name || CanvasTeacherComponent.label}
        </text>
      </g>
    );
  }
}
