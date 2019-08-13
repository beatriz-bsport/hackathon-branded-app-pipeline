// @flow

import React from 'react';
import Typography from '@material-ui/core/Typography';

export default (props: { children: string }) => (
  <Typography component="div" {...props}>
    {(props.children || '').split('\n\n').map((p, idx) => (
      <p key={idx}>
        {p.split('\n').map((d, idx_) => (
          <div key={idx_}>{d}</div>
        ))}
      </p>
    ))}
  </Typography>
);
