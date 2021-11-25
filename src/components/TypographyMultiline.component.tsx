import omit from 'lodash/omit';
import React from 'react';
import Typography from '@material-ui/core/Typography';

export default (props: { children: string }) => (
  <Typography
    component="div"
    {...omit(props, [
      'classes',
      'defaultNS',
      'i18n',
      'i18nOptions',
      'reportNS',
      't',
      'tReady',
      'multiline',
    ])}
  >
    <p style={{ whiteSpace: 'pre-line' }}>{props.children || ''}</p>
  </Typography>
);
