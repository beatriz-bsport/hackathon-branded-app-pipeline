import React, { SVGProps } from 'react';

export const SadSmileyIcon: React.FC<SVGProps<SVGElement>> = ({
  width,
  height,
  viewBox,
  xmlns,
  fill,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      fill={fill}
      xmlns={xmlns}
    >
      <circle cx="55" cy="55" r="55" fill="#2196F3" fillOpacity="0.08" />
      <path
        d="M48 43.0012C48 47.419 44.1948 51 39.5 51C34.8052 51 31 47.4192 31 43.0012C31 38.5832 34.8052 35 39.5 35C44.1948 35 48 38.5832 48 43.0012Z"
        fill="#2196F3"
      />
      <path
        d="M79 43.0012C79 47.419 75.1954 51 70.5013 51C65.8072 51 62 47.4192 62 43.0012C62 38.5832 65.8071 35 70.5013 35C75.1954 35 79 38.5832 79 43.0012Z"
        fill="#2196F3"
      />
      <path
        d="M66.4064 60.8798C55.5107 57.7559 39.2625 56.9849 23.7434 71.0671C22.7238 71.9943 22.7577 73.4645 23.8161 74.3516C24.3343 74.7867 24.9955 75 25.6639 75C26.3663 75 27.0638 74.7613 27.5845 74.2882C53.561 50.7266 81.3281 73.3757 82.4925 74.3516C83.5556 75.2366 85.2413 75.2112 86.2584 74.2818C87.2756 73.3588 87.2417 71.8887 86.1858 70.9995C85.8588 70.7249 77.995 64.2047 66.4067 60.8798H66.4064Z"
        fill="#2196F3"
      />
    </svg>
  );
};

SadSmileyIcon.defaultProps = {
  width: '110',
  height: '110',
  viewBox: '0 0 110 110',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
};

export default React.memo(SadSmileyIcon);
