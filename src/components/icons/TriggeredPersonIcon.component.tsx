import React, { SVGProps } from 'react';

export const TriggeredPersonIcon: React.FC<SVGProps<SVGElement>> = ({
  width,
  height,
  viewBox,
  xmlns,
  fill,
}) => {
  return (
    <svg
      fill={fill}
      height={height}
      viewBox={viewBox}
      width={width}
      xmlns={xmlns}
    >
      <path d="M13.6801 7.68997C15.5401 7.68997 17.0301 6.18997 17.0301 4.32997C17.0301 2.46997 15.5401 0.969971 13.6801 0.969971C11.8201 0.969971 10.3201 2.46997 10.3201 4.32997C10.3201 6.18997 11.8201 7.68997 13.6801 7.68997Z" />
      <path d="M13.68 9.92999C12.85 9.92999 11.76 10.06 10.66 10.33L7.5 16.65H21.52V13.85C21.52 11.24 16.29 9.92999 13.68 9.92999Z" />
      <path d="M5.04998 11.97H0.47998L6.08998 1.03998V8.15998H10.49L5.04998 19.03V11.97Z" />
    </svg>
  );
};

TriggeredPersonIcon.defaultProps = {
  width: '22',
  height: '20',
  viewBox: '0 0 22 20',
  fill: 'black',
  xmlns: 'http://www.w3.org/2000/svg',
};

export default React.memo(TriggeredPersonIcon);
