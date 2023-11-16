import React from 'react';
import type { SvgIconProps } from '@material-ui/core/SvgIcon';
import chroma from 'chroma-js';
import MuiSvgIcon from './MuiSvgIcon.component';

const SwitchHorizontalShadowIcon: React.FC<SvgIconProps> = (props) => {
  const fillRGB = chroma(props?.fill).rgb();
  const dropShadow = `drop-shadow(0px 1px 0px rgba(${fillRGB[0]} ${fillRGB[1]} ${fillRGB[2]} /0.2))`;

  return (
    <MuiSvgIcon {...props}>
      <path
        d="M5.816 4L6.5 4C7.348 4 8.095 4.512 8.547 5.287C8.829 4.62 9.214 4.008 9.678 3.465C8.864 2.561 7.74 2 6.5 2L5.816 2C5.401 0.839 4.302 -2.34992e-07 3 -2.91905e-07C1.346 -3.64203e-07 8.94839e-07 1.346 8.2254e-07 3C7.50242e-07 4.654 1.346 6 3 6C4.302 6 5.401 5.161 5.816 4ZM2 3C2 2.448 2.449 2 3 2C3.551 2 4 2.448 4 3C4 3.552 3.551 4 3 4C2.449 4 2 3.552 2 3Z"
        fill={props?.fill}
        filter={dropShadow}
      />

      <path
        d="M14.185 12L13.834 12C12.849 12 11.982 11.465 11.474 10.655C11.2 11.32 10.828 11.934 10.374 12.478C11.252 13.414 12.476 14 13.833 14L14.184 14C14.599 15.161 15.698 16 17 16C18.654 16 20 14.654 20 13C20 11.346 18.654 10 17 10C15.698 10 14.599 10.839 14.185 12ZM18 13C18 13.552 17.551 14 17 14C16.449 14 16 13.552 16 13C16 12.448 16.449 12 17 12C17.551 12 18 12.448 18 13Z"
        fill={props?.fill}
        filter={dropShadow}
      />

      <path
        d="M5.836 13.935C8.749 13.525 11 11.024 11 8C11 6.064 12.381 4.448 14.209 4.08C14.645 5.2 15.728 6 17 6C18.654 6 20 4.654 20 3C20 1.346 18.654 -5.88355e-08 17 -1.31134e-07C15.674 -1.89095e-07 14.56 0.87 14.164 2.065C11.251 2.475 9 4.976 9 8C9 9.936 7.619 11.552 5.791 11.92C5.355 10.8 4.272 10 3 10C1.346 10 -4.95949e-07 11.346 -5.68248e-07 13C-6.40547e-07 14.654 1.346 16 3 16C4.326 16 5.44 15.13 5.836 13.935ZM18 3C18 3.552 17.551 4 17 4C16.449 4 16 3.552 16 3C16 2.448 16.449 2 17 2C17.551 2 18 2.448 18 3ZM2 13C2 12.448 2.449 12 3 12C3.551 12 4 12.448 4 13C4 13.552 3.551 14 3 14C2.449 14 2 13.552 2 13Z"
        fill={props?.fill}
        filter={dropShadow}
      />
    </MuiSvgIcon>
  );
};
SwitchHorizontalShadowIcon.defaultProps = {
  width: '16',
  height: '20',
  viewBox: '0 0 20 16',
  fill: 'black',
  xmlns: 'http://www.w3.org/2000/svg',
};

export default React.memo(SwitchHorizontalShadowIcon);
