// @flow

import React from 'react';
import TextField from '@material-ui/core/TextField';

// prettier-ignore
export const emailRegexp = /[A-z0-9-_]+@[A-z0-9-_]+\.[A-z]+$/

type Props = {
  value: any,
};

export default function EmailFied(props: Props) {
  return (
    <TextField
      error={props.value && !emailRegexp.test(props.value)}
      {...props}
    />
  );
}
