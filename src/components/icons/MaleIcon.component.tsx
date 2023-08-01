import React, { SVGProps } from 'react';
import './GenderIcon.css';

export type MaleIconProps = { isMobile: boolean } & SVGProps<SVGElement>;

export const MaleIcon: React.FC<MaleIconProps> = ({
  isMobile,
  width,
  height,
  viewBox,
  xmlns,
  fill,
}) => {
  return (
    <div className="bs-genderIconContainer">
      <svg
        className={isMobile ? 'bs-genderIconMobile' : 'bs-genderIcon'}
        fill={fill}
        height={height}
        viewBox={viewBox}
        width={width}
        xmlns={xmlns}
      >
        <path
          d="M4 4C4.86 4 5.66667 4.27333 6.31333 4.74L9.72 1.33333H6.66667V0H12V5.33333H10.6667V2.27333L7.26 5.66667C7.72667 6.33333 8 7.13333 8 8C8 9.06087 7.57857 10.0783 6.82843 10.8284C6.07828 11.5786 5.06087 12 4 12C2.93913 12 1.92172 11.5786 1.17157 10.8284C0.421427 10.0783 0 9.06087 0 8C0 6.93913 0.421427 5.92172 1.17157 5.17157C1.92172 4.42143 2.93913 4 4 4ZM4 5.33333C3.29276 5.33333 2.61448 5.61428 2.11438 6.11438C1.61428 6.61448 1.33333 7.29276 1.33333 8C1.33333 8.70724 1.61428 9.38552 2.11438 9.88562C2.61448 10.3857 3.29276 10.6667 4 10.6667C4.70724 10.6667 5.38552 10.3857 5.88562 9.88562C6.38572 9.38552 6.66667 8.70724 6.66667 8C6.66667 7.29276 6.38572 6.61448 5.88562 6.11438C5.38552 5.61428 4.70724 5.33333 4 5.33333Z"
          fill={fill}
        />
      </svg>
    </div>
  );
};

MaleIcon.defaultProps = {
  width: '12',
  height: '12',
  viewBox: '0 0 12 12',
  fill: 'currentColor',
  xmlns: 'http://www.w3.org/2000/svg',
};

export default React.memo(MaleIcon);
