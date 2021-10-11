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
    {(props.children || '').split('\n\n').map((p, idx) => (
      <p key={idx}>
        {p.split('\n').map((d, idx_) => (
          <div key={idx_}>{d}</div>
        ))}
      </p>
    ))}
  </Typography>
);
