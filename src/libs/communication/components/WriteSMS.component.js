// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation, TFunction } from 'react-i18next';
import { compose } from 'recompose';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { util } from '#libs/communication-v2/components/convertEncode.utils';

import {
  MAX_LENGTH_SMS,
  MAX_LENGTH_AUTOMATIC_SMS,
} from '#libs/communication-v2/constants';

type Props = {
  classes: Object,
  t: TFunction,
  smsContent: string,
  onChangeContent: (string) => void,
  countReceivers: number,
  hideSmsCount?: boolean,
  contentLengthError?: Boolean,
};

export function WriteSMS(props: Props) {
  const { t } = props;

  function computeNbSms(maxLength) {
    let nbMoreSms = 0;
    if (props.smsContent.length > maxLength) {
      const nbCaracterIncludingConcatenation = maxLength === 160 ? 7 : 3;
      nbMoreSms =
        parseInt(
          (props.smsContent.length - maxLength - 1) /
            (maxLength - nbCaracterIncludingConcatenation),
          10,
        ) + 1;
    }
    return nbMoreSms + 1;
  }

  const smsMaxLength =
    util.pickencoding(props.smsContent) === 'gsm'
      ? MAX_LENGTH_SMS
      : MAX_LENGTH_AUTOMATIC_SMS;

  return (
    <div className={props.classes.container}>
      <TextField
        fullWidth
        multiline
        label={t('mail.contentSms')}
        name="Mail content"
        onChange={(e) => props.onChangeContent(e.target.value)}
        rows="15"
        value={props.smsContent}
        variant="outlined"
      />
      <div className={props.classes.countContainer}>
        <Typography
          color={props.contentLengthError ? 'error' : ''}
          variant="caption"
        >
          {`${props.smsContent.length} / ${smsMaxLength} ${t('mail.count')}`}
        </Typography>
        {!props.hideSmsCount && (
          <Typography
            color={props.countReceivers > 200 ? 'error' : undefined}
            variant={props.countReceivers > 200 ? 'h6' : undefined}
          >
            {`= ${
              props.countReceivers ? `${props.countReceivers} x ` : ''
            }${computeNbSms(smsMaxLength)} ${t('mail.numberSms')}`}
          </Typography>
        )}
      </div>
    </div>
  );
}

const styles = (theme) => ({
  container: { marginTop: theme.spacing(1) },
  countContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default compose(
  withTranslation(['communication']),
  withStyles(styles),
)(WriteSMS);
