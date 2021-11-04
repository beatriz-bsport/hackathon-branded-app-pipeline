import React from 'react';
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
        <svg
          width={CanvasTeacherComponent.avatarSize}
          height={CanvasTeacherComponent.avatarSize}
          x={-CanvasTeacherComponent.avatarSize / 4}
          y={-CanvasTeacherComponent.avatarSize / 4}
        >
          <defs>
            <pattern
              id="image"
              patternUnits="userSpaceOnUse"
              height={CanvasTeacherComponent.avatarSize}
              width={CanvasTeacherComponent.avatarSize}
            >
              <image
                x={0}
                y={0}
                height={CanvasTeacherComponent.avatarSize}
                width={CanvasTeacherComponent.avatarSize}
                xlinkHref={
                  this.props.coach?.photo ||
                  'https://d2r95z4j5cc9cx.cloudfront.net/gymnast-female.png'
                }
                preserveAspectRatio="xMidYMid slice"
              />
            </pattern>
          </defs>
          <circle
            id="top"
            cx={CanvasTeacherComponent.avatarSize / 2}
            cy={CanvasTeacherComponent.avatarSize / 2}
            r={CanvasTeacherComponent.avatarSize / 2}
            fill="url(#image)"
          />
        </svg>
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
          x={CanvasTeacherComponent.avatarSize / 4}
          y={CanvasTeacherComponent.avatarSize}
          dominantBaseline="middle"
          textAnchor="middle"
          style={{ userSelect: 'none' }}
        >
          {this.props.coach?.name || CanvasTeacherComponent.label}
        </text>
      </g>
    );
  }
}
