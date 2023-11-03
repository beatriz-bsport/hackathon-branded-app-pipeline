import React from 'react';
import CanvasBaseComponent from '../BaseClasses/Base.component';

export interface CanvasRectProps {
  x: number;
  y: number;
  width: number;
  height: number;
  stroke?: React.SVGAttributes<SVGPolylineElement>['stroke'];
  fill?: React.SVGAttributes<SVGPolylineElement>['fill'];
  rotation?: number;
  image?: string;
  strokeWidth?: React.SVGAttributes<SVGPolylineElement>['strokeWidth'];
  strokeDasharray?: React.SVGAttributes<SVGPolylineElement>['strokeDasharray'];
}

export default class CanvasRectComponent extends CanvasBaseComponent<CanvasRectProps> {
  render() {
    const {
      x,
      y,
      width,
      height,
      stroke,
      fill,
      rotation,
      image,
      strokeWidth,
      strokeDasharray,
    } = this.props;
    if (!image) {
      /* In this case Rect is use to actually display a rectangle on the map */
      return (
        <rect
          {...this.BaseProps}
          className="svg-element"
          data-rotation={rotation || 0}
          fill={fill || 'transparent'}
          height={height || 0}
          stroke={stroke || 'black'}
          strokeWidth={strokeWidth ?? 2}
          transform={
            rotation && `rotate(${rotation} ${x + width / 2} ${y + height / 2})`
          }
          width={width || 0}
          x={x || 0}
          y={y || 0}
          {...(strokeDasharray ? { strokeDasharray } : {})}
        />
      );
    }
    // The method shown below is the most effective way I've found to
    // preserve an image that perfectly fits the viewbox of its container.
    return (
      <g
        {...this.BaseProps}
        className="svg-element unbounded-asset-group"
        transform={
          rotation && `rotate(${rotation} ${x + width / 2} ${y + height / 2})`
        }
      >
        <svg height={height || 0} width={width || 0} x={x || 0} y={y || 0}>
          <defs>
            <pattern
              height="100%"
              id={`image${this.BaseProps.id}`}
              patternContentUnits="objectBoundingBox"
              patternUnits="userSpaceOnUse"
              width="100%"
            >
              <image
                height={1}
                href={image}
                preserveAspectRatio="xMidYMid slice"
                width={1}
                x={0}
                y={0}
              />
            </pattern>
          </defs>
          <rect
            fill={`url(#image${this.BaseProps.id})`}
            height="100%"
            patternContentUnits="objectBoundingBox"
            width="100%"
          />
        </svg>
      </g>
    );
  }
}
