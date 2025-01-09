import React, { SVGProps } from 'react';

type SubdirectoryArrowRightProps = {
  className?: string;
} & SVGProps<SVGElement>;

export const SubdirectoryArrowRight: React.FC<SubdirectoryArrowRightProps> = ({
  className,
  width,
  height,
  viewBox,
  xmlns,
  fill,
}) => {
  return (
    <svg
      className={className}
      fill={fill}
      height={height}
      viewBox={viewBox}
      width={width}
      xmlns={xmlns}
    >
      <path d="M12.667 10L8.66699 14L7.72033 13.0533L10.1137 10.6667H2.66699V2.66666H4.00033V9.33333H10.1137L7.72033 6.94666L8.66699 6L12.667 10Z" />
    </svg>
  );
};

SubdirectoryArrowRight.defaultProps = {
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
  fill: '#9E9E9E',
  xmlns: 'http://www.w3.org/2000/svg',
};

export default React.memo(SubdirectoryArrowRight);
