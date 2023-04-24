// @ts-nocheck
import React, { SVGProps } from 'react';

const BookIcon: React.FC<SVGProps<SVGElement>> = ({
  width,
  height,
  viewBox,
  xmlns,
  fill,
}) => {
  return (
    <>
      <svg
        width={width}
        height={height}
        viewBox={viewBox}
        fill={fill}
        xmlns={xmlns}
      >
        <path
          d="M2 8.4C2 8.4 6.8 2 18 2C29.2 2 34 8.4 34 8.4V53.2C34 53.2 29.2 50 18 50C6.8 50 2 53.2 2 53.2V8.4ZM34 8.4C34 8.4 38.8 2 50 2C61.2 2 66 8.4 66 8.4V53.2C66 53.2 61.2 50 50 50C38.8 50 34 53.2 34 53.2V8.4Z"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
};

BookIcon.defaultProps = {
  width: '68',
  height: '55',
  viewBox: '0 0 68 55',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
};

export default BookIcon;
