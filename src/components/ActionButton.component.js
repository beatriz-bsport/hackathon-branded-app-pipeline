import React from 'react';

const VALIDATE_ASSET = require('../public/images/validate.png');
const CANCEL_ASSET = require('../public/images/remove.png');
export default function ActionButton(props) {
  let src = '';
  switch (props.variant) {
    case 'cancel':
      src = CANCEL_ASSET;
      break;
    case 'validate':
      src = VALIDATE_ASSET;
      break;
  }

  return <img height={20} width={20} src={src} />;
}
