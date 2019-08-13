import React from 'react';
import Typography from '@material-ui/core/Typography';

export default (props: { children: string }) => (
  <Typography component="div" {...props}>
    {(props.children || '').split('\n\n').map((p) => (
      <p>
        {p.split('\n').map((d) => (
          <div>{d}</div>
        ))}
      </p>
    ))}
  </Typography>
);
