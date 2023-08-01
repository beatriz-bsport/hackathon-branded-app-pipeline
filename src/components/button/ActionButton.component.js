// @flow
import React from 'react';

const VALIDATE_ASSET = require('../../public/images/validate.png');

const CANCEL_ASSET = require('../../public/images/remove.png');

type Props = {
  variant: ?string,
};
export default function ActionButton(props: Props) {
  let src = '';
  switch (props.variant) {
    case 'cancel':
      src = CANCEL_ASSET;
      break;
    case 'validate':
    default:
      src = VALIDATE_ASSET;
      break;
  }

  return <img alt={props.variant} height={20} src={src} width={20} />;
}
