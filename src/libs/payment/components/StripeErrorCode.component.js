// @flow
import React from 'react';

import Typography from '@material-ui/core/Typography';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

type Props = {
  errorCode: string,
  declineCode: string,
  t: TFunction,
};

export const StripeErrorCode = (props: Props) => (
  <React.Fragment>
    <Typography variant="caption" color="error">
      {props.t(`error_code.${props.errorCode}`)}
    </Typography>
    <Typography variant="caption" color="error">
      {props.t(`decline_code.${props.declineCode || 'none'}`)}
    </Typography>
  </React.Fragment>
);

export default withTranslation(['stripe'])(StripeErrorCode);
