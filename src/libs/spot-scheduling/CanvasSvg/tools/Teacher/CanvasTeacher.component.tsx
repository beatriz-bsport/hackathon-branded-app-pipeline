import React from 'react';
import CanvasBaseComponent from '../BaseClasses/Base.component';
import DEFAULT_PROFILE_PICTURE_URL from '../../../../../assets/constants';

export interface CanvasTeacherProps {
  x: number;
  y: number;
  rotation: number;
  stroke: React.SVGAttributes<SVGPolylineElement>['stroke'];
  fill: React.SVGAttributes<SVGPolylineElement>['fill'];
  coach?: any;
  coachHeight: number;
  height?: number;
  fontSize?: React.SVGAttributes<SVGPolylineElement>['height'];
  fontStyle?: React.SVGAttributes<SVGPolylineElement>['height'];
  textOffsetX?: number;
  textOffsetY?: number;
  fontColor?: React.SVGAttributes<SVGPolylineElement>['fill'];
  fontWeight?: React.SVGAttributes<SVGPolylineElement>['fontWeight'];
  textStroke?: React.SVGAttributes<SVGPolylineElement>['stroke'];
  textStrokeWidth?: React.SVGAttributes<SVGPolylineElement>['strokeWidth'];
}

const MARGIN_BETWEEN_AVATAR_AND_TEXT = 15;
export const COACH_CANVAS_AVATAR_DEFAULT_SIZE = 80;
export default class CanvasTeacherComponent extends CanvasBaseComponent<CanvasTeacherProps> {
  static zIndex = 99;

  static label = '';

  static avatarSize = COACH_CANVAS_AVATAR_DEFAULT_SIZE;

  static getTransform(x: number, y: number, rotation: number) {
    return `translate(${x} ${y}) rotate(${rotation} ${31.5 / 2} ${35 / 2})`;
  }

  render() {
    const {
      x,
      y,
      rotation,
      height,
      fontSize,
      fontStyle,
      textOffsetX,
      textOffsetY,
      fontColor,
      fontWeight,
      textStroke,
      textStrokeWidth,
    } = this.props;

    const avatarSize =
      (height ?? CanvasTeacherComponent.avatarSize) * this.props.coachHeight;

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
                  this.props.coach?.photo || DEFAULT_PROFILE_PICTURE_URL
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
          x={(textOffsetX ?? 0) + avatarSize / 4}
          y={
            (textOffsetY ?? 0) +
            avatarSize -
            avatarSize / 4 +
            MARGIN_BETWEEN_AVATAR_AND_TEXT
          }
          {...(fontSize ? { fontSize } : {})}
          {...(fontStyle ? { fontStyle } : {})}
          {...(fontColor ? { fontColor } : {})}
          {...(fontWeight ? { fontWeight } : {})}
          {...(textStroke ? { stroke: textStroke } : {})}
          {...(textStrokeWidth ? { strokeWidth: textStrokeWidth } : {})}
        >
          {this.props.coach?.name || CanvasTeacherComponent.label}
        </text>
      </g>
    );
  }
}
