import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const MuiSvgIcon: React.FC<SvgIconProps> = ({ children, ...props }) => {
  return <SvgIcon {...props}>{children}</SvgIcon>;
};

MuiSvgIcon.defaultProps = {
  width: '18',
  height: '19',
  viewBox: '0 0 18 19',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
};

// CF :  TODO (Use this component as reference to build CustomIcons): https://gitlab.com/bsport/bsport-saas/-/issues/1282
export default React.memo(MuiSvgIcon);
