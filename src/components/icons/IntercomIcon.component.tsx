import React, { SVGProps } from 'react';

type IntercomIconProps = { className?: string } & SVGProps<SVGElement>;

export const IntercomIcon: React.FC<IntercomIconProps> = ({
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
      width={width}
      height={height}
      viewBox={viewBox}
      fill={fill}
      xmlns={xmlns}
    >
      <path d="M14.492 0H2.07816C0.91954 0 0 0.91954 0 2.05977C0 3.2 0 14.4736 0 14.4736C0 15.6322 0.91954 16.5517 2.07816 16.5517H14.492C15.6322 16.5517 16.5517 15.6322 16.5517 14.492V2.07816C16.5517 0.91954 15.6322 0 14.492 0ZM14.1609 12.5609C14.069 12.6345 12.0276 14.3448 8.27586 14.3448C4.52414 14.3448 2.48276 12.6345 2.3908 12.5609C2.15172 12.3586 2.13333 12.0092 2.33563 11.7885C2.53793 11.5494 2.88736 11.531 3.10805 11.7333C3.14483 11.7333 4.96552 13.2414 8.27586 13.2414C11.623 13.2414 13.4253 11.7333 13.4253 11.7149C13.6644 11.5126 14.0138 11.5494 14.1977 11.7701C14.4184 12.0092 14.3816 12.3586 14.1609 12.5609Z" />
      <path d="M16.5517 19.3485V14.9499C16.5517 14.7502 16.3292 14.6311 16.163 14.7419L13.4482 16.5518L16.1159 19.5158C16.2691 19.6861 16.5517 19.5777 16.5517 19.3485Z" />
    </svg>
  );
};

IntercomIcon.defaultProps = {
  width: '17',
  height: '20',
  viewBox: '0 0 17 20',
  fill: 'rgba(40,110,250,1)',
  xmlns: 'http://www.w3.org/2000/svg',
};

export default React.memo(IntercomIcon);
