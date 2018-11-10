import React, { Component } from 'react';
import { TextField } from '@material-ui/core';

// prettier-ignore
const emailRegexp = new RegExp('[A-z0-9-_]+@[A-z0-9-_]+\.[A-z]+$');

export default function EmailFied(props) {
  return (
    <TextField
      error={props.value && !emailRegexp.test(props.value)}
      {...props}
    />
  );
}
