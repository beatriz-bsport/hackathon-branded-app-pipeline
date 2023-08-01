import React from 'react';
import CanvasBaseComponent from '../BaseClasses/Base.component';

export interface CanvasTeacherProps {
  x: number;
  y: number;
  rotation: number;
  stroke: string;
  fill: string;
  coach?: any;
  coachHeight: number;
}

const MARGIN_BETWEEN_AVATAR_AND_TEXT = 15;
export default class CanvasTeacherComponent extends CanvasBaseComponent<CanvasTeacherProps> {
  static zIndex = 99;

  static label = '';

  static avatarSize = 80;

  static getTransform(x: number, y: number, rotation: number) {
    return `translate(${x} ${y}) rotate(${rotation} ${31.5 / 2} ${35 / 2})`;
  }

  render() {
    const { x, y, rotation } = this.props;
    const avatarSize =
      CanvasTeacherComponent.avatarSize * this.props.coachHeight;

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
          height={avatarSize}
          width={avatarSize}
          x={-avatarSize / 4}
          y={-avatarSize / 4}
        >
          <defs>
            <pattern
              height={avatarSize}
              id="image"
              patternUnits="userSpaceOnUse"
              width={avatarSize}
            >
              <image
                height={avatarSize}
                preserveAspectRatio="xMidYMid slice"
                width={avatarSize}
                x={0}
                xlinkHref={
                  this.props.coach?.photo ||
                  'https://d2r95z4j5cc9cx.cloudfront.net/gymnast-female.png'
                }
                y={0}
              />
            </pattern>
          </defs>
          <circle
            cx={avatarSize / 2}
            cy={avatarSize / 2}
            fill="url(#image)"
            id="top"
            r={avatarSize / 2}
          />
        </svg>
        <rect
          fill="transparent"
          height={avatarSize}
          stroke="transparent"
          visibility="visible"
          width={avatarSize}
          x={-avatarSize / 4}
          y={-avatarSize / 4}
        />
        <text
          dominantBaseline="middle"
          style={{ userSelect: 'none' }}
          textAnchor="middle"
          x={avatarSize / 4}
          y={avatarSize - avatarSize / 4 + MARGIN_BETWEEN_AVATAR_AND_TEXT}
        >
          {this.props.coach?.name || CanvasTeacherComponent.label}
        </text>
      </g>
    );
  }
}
