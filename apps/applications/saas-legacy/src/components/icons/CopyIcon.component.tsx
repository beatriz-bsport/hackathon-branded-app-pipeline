import React from 'react';
import { SvgIcon, SvgIconProps } from '@material-ui/core';

export default React.memo((props: SvgIconProps) => (
  <SvgIcon {...props}>
    <svg focusable="false" viewBox="0 0 24 24">
      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2m0 16H8V7h11z"></path>
    </svg>
  </SvgIcon>
));
