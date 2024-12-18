import React from 'react';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import MuiSvgIcon from './MuiSvgIcon.component';

const StopBuildIcon: React.FC<SvgIconProps> = (props) => {
  return (
    <MuiSvgIcon {...props}>
      <path d="M5.71621 11.6834L11.1829 6.2167C11.1579 4.87503 10.6245 3.5417 9.58288 2.50003C7.91621 0.833364 5.41621 0.50003 3.41621 1.4167L6.99954 5.00003L4.49954 7.50003L0.832876 3.9167C-0.167124 5.9167 0.249543 8.4167 1.91621 10.0834C2.98288 11.15 4.34954 11.675 5.71621 11.6834Z" />

      <path d="M11.0916 8.50833L17.6583 1.94166L16.6083 0.891663L8.47494 9.025L6.9166 10.5833L0.391602 17.1083L1.4416 18.1583L7.9666 11.6333L14.2499 17.9167C14.5833 18.25 15.0833 18.25 15.4166 17.9167L17.3333 16C17.7499 15.6667 17.7499 15.0833 17.4166 14.8333L11.0916 8.50833V8.50833Z" />
    </MuiSvgIcon>
  );
};

StopBuildIcon.defaultProps = {
  width: '18',
  height: '19',
  viewBox: '0 0 18 19',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
};

// CF :  TODO (Use this component as reference to build CustomIcons): https://gitlab.com/bsport/bsport-saas/-/issues/1282
export default React.memo(StopBuildIcon);
