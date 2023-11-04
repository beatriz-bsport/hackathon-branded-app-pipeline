import React, { SVGAttributes as SvgAttributes, ReactNode, Ref } from 'react';

export type ResizeObserverContentRect = ResizeObserverEntry['contentRect'];

export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export interface UseParentSizeOptions {
  debounceDelay: number;
  initialValues: Partial<ResizeObserverContentRect>;
  transformFunc?: (
    entry: Partial<ResizeObserverContentRect>,
  ) => Partial<ResizeObserverContentRect>;
  maxDifference?: number;
  callback?(entry: ResizeObserverContentRect): void;
}

export type UseParentSizeResult = Partial<ResizeObserverContentRect>;

export type PreserveAspectRatioAlignment =
  | 'xMinYMin'
  | 'xMidYMin'
  | 'xMaxYMin'
  | 'xMinYMid'
  | 'xMidYMid'
  | 'xMaxYMid'
  | 'xMinYMax'
  | 'xMidYMax'
  | 'xMaxYMax';

export type MeetOrSlice = 'meet' | 'slice';

export type PreserveAspectRatio =
  | `${PreserveAspectRatioAlignment} ${MeetOrSlice}`
  | 'none';

export type AddSVGProps<Props, Element extends SVGElement> = Props &
  Omit<React.SVGProps<Element>, keyof Props>;

export interface Point {
  x: number;
  y: number;
}

export type SVGAttributes<T> = T &
  Omit<
    SvgAttributes<SVGSVGElement>,
    'origin' | 'viewBox' | 'preserveAspectRatio' | 'children '
  >;

export type ResponsiveSVGProps = SVGAttributes<{
  width?: number;
  height?: number;
  origin?: Point;
  preserveAspectRatio?: PreserveAspectRatio;
  innerRef?: Ref<SVGSVGElement>;
  className?: string;
  hide?: boolean;
  children: ReactNode;
  overflow?: 'hidden' | 'visible';
}>;
