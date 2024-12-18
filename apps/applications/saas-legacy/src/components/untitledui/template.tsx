import React, { FC, forwardRef, Ref } from 'react';

interface SVGParentProps extends React.SVGProps<SVGSVGElement> {
  size?: string;
}

interface PathProps extends React.SVGProps<SVGPathElement> {}

export interface SVGComponentProps extends SVGParentProps {
  size?: string;
  pathProps?: React.SVGProps<SVGPathElement>;
}

const SVG: FC<SVGParentProps> = forwardRef<SVGSVGElement, SVGParentProps>(
  (
    {
      size,
      height,
      width,
      fill,
      strokeWidth,
      stroke,
      className,
      children,
      viewBox,
      ...props
    },
    ref: Ref<SVGSVGElement>,
  ) => {
    return (
      <svg
        ref={ref}
        className={className}
        fill={fill || 'none'}
        height={size && height ? height : size || '24'}
        stroke={stroke || 'black'}
        strokeWidth={strokeWidth || '2'}
        viewBox={viewBox || '0 0 24 24'}
        width={size && width ? width : size || '24'}
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        {children}
      </svg>
    );
  },
);

const Path: FC<PathProps> = forwardRef<SVGPathElement, PathProps>(
  (props, ref: Ref<SVGPathElement>) => {
    return (
      <path
        {...props}
        ref={ref}
        stroke={props.stroke ? props.stroke : 'inherit'}
        strokeLinecap={props.strokeLinecap ? props.strokeLinecap : 'round'}
        strokeLinejoin={props.strokeLinejoin ? props.strokeLinejoin : 'round'}
        strokeWidth={props.width ? props.width : 2}
      />
    );
  },
);

export { SVG, Path };
