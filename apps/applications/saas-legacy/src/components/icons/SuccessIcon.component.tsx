import React, { SVGProps } from 'react';

type SuccessIconProps = { className?: string } & SVGProps<SVGElement>;

export const SuccessIcon: React.FC<SuccessIconProps> = ({
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
      <path d="M0 21L14 16L5 6.99997L0 21Z" />
      <path d="M12.5302 11.53L18.1202 5.93995C18.6102 5.44995 19.4002 5.44995 19.8902 5.93995L20.4802 6.52995L21.5402 5.46995L20.9502 4.87995C19.8802 3.80995 18.1302 3.80995 17.0602 4.87995L11.4702 10.47L12.5302 11.53Z" />
      <path d="M8.06021 5.87996L7.47021 6.46996L8.53021 7.52996L9.12021 6.93996C10.1902 5.86996 10.1902 4.11996 9.12021 3.04996L8.53021 2.45996L7.47021 3.52996L8.06021 4.11996C8.54022 4.59996 8.54022 5.39996 8.06021 5.87996Z" />
      <path d="M15.0602 10.88L13.4702 12.47L14.5302 13.53L16.1202 11.94C16.6102 11.45 17.4002 11.45 17.8902 11.94L19.5002 13.55L20.5602 12.49L18.9502 10.88C17.8702 9.80995 16.1302 9.80995 15.0602 10.88Z" />
      <path d="M13.0602 4.87996L9.47021 8.46996L10.5302 9.52996L14.1202 5.93996C15.1902 4.86996 15.1902 3.11996 14.1202 2.04996L12.5302 0.459961L11.4702 1.51996L13.0602 3.10996C13.5402 3.59996 13.5402 4.39996 13.0602 4.87996Z" />
    </svg>
  );
};

SuccessIcon.defaultProps = {
  width: '22',
  height: '21',
  viewBox: '0 0 22 21',
  fill: '#000',
  xmlns: 'http://www.w3.org/2000/svg',
};

export default React.memo(SuccessIcon);
