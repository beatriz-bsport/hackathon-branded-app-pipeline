// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose } from 'recompose';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { unicodeToGsm } from './convertEncode.utils';

type Props = {
  classes: Object,
  t: TFunction,
  smsContent: string,
  onChangeContent: (string) => void,
  countReceivers: number,
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

  const util = {
    map: (sub, func) => {
      return [].map.apply(sub, [func]);
    },
    /* eslint-disable */

    isHighSurrogate: (c) => {
      const codeUnit = c.charCodeAt !== undefined ? c.charCodeAt(0) : c;
      return codeUnit >= 0xd800 && codeUnit <= 0xdbff;
    },

    /**
    take a string and return a list of the unicode codepoints
    */
    unicodeCodePoints: function(string) {
      var charCodes = util.map(string, function(x) {
        return x.charCodeAt(0);
      });
      var result = [];
      while (charCodes.length > 0) {
        if (util.isHighSurrogate(charCodes[0])) {
          var high = charCodes.shift();
          var low = charCodes.shift();
          result.push((high - 0xd800) * 0x400 + (low - 0xdc00) + 0x10000);
        } else {
          result.push(charCodes.shift());
        }
      }
      return result;
    },

    pickencoding: function(s) {
      // choose gsm if possible otherwise ucs2
      if (
        util.unicodeCodePoints(s).every(function(x) {
          return x in unicodeToGsm;
        })
      ) {
        return 'gsm';
      } else {
        return 'ucs2';
      }
    },
  };
  /* eslint-enable */
  const smsMaxLength = util.pickencoding(props.smsContent) === 'gsm' ? 160 : 70;

  return (
    <div className={props.classes.container}>
      <TextField
        name="Mail content"
        label={t('mail.contentSms')}
        rows="15"
        value={props.smsContent}
        onChange={(e) => props.onChangeContent(e.target.value)}
        fullWidth
        multiline
        variant="outlined"
      />
      <div className={props.classes.countContainer}>
        <Typography vraient="caption">
          {`${props.smsContent.length} / ${smsMaxLength} ${t('mail.count')}`}
        </Typography>
        <Typography
          variant={props.countReceivers > 200 ? 'h6' : undefined}
          color={props.countReceivers > 200 ? 'error' : undefined}
        >
          {`= ${
            props.countReceivers ? `${props.countReceivers} x ` : ''
          }${computeNbSms(smsMaxLength)} ${t('mail.numberSms')}`}
        </Typography>
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
