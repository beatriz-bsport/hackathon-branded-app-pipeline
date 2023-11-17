import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { ReportProblemOutlined as WarningIcon } from '@material-ui/icons';
import { amber, red } from '@material-ui/core/colors';

import TextFieldWithChildren from '#components/input/text-field/TextFieldWithChildren';
import { util } from '#libs/communication-v2/components/convertEncode.utils';
import {
  MAX_LENGTH_SMS,
  MAX_LENGTH_AUTOMATIC_SMS,
} from '#libs/communication-v2/constants';

type Props = {
  children: React.ReactNode;
  handleChangeContent: (event: React.ChangeEvent) => void;
  onFocus?: () => void;
  isMobileSize?: boolean;
  minimalBottom?: boolean; // for specific use such as sequential marketing
  smsContent: string;
};

const CommunicationWriteSMS: React.FC<Props> = ({
  children,
  handleChangeContent,
  onFocus,
  isMobileSize,
  minimalBottom,
  smsContent,
}) => {
  const { t } = useTranslation('communication');

  const classes = useStyles();

  const smsMaxLength =
    util.pickencoding(smsContent) === 'gsm'
      ? MAX_LENGTH_SMS
      : MAX_LENGTH_AUTOMATIC_SMS;

  const nbSmsToSend = Math.ceil(smsContent?.length / smsMaxLength);

  return (
    <React.Fragment>
      <TextFieldWithChildren
        changeValue={handleChangeContent}
        customOptions={{
          display: { column: true },
          rows: {
            minRows: isMobileSize ? 2 : 6,
          },
          focus: {
            onFocus,
          },
        }}
        name="Sms content"
        placeholder={t('sendMessage.textField.content')}
        value={smsContent}
      >
        <div
          className={classNames({
            [classes.bottom]: !minimalBottom,
            [classes.minimalBottom]: minimalBottom,
          })}
        >
          {minimalBottom && children}
          {nbSmsToSend > 1 ? (
            <div className={classes.warningContainer}>
              <WarningIcon className={classes.warningIcon} />
              <Typography className={classes.warningText} variant="caption">
                {t('sendMessage.textField.warningLength', {
                  number_sms: nbSmsToSend,
                })}
              </Typography>
              <Typography className={classes.warningText} variant="caption">
                {`${smsContent?.length ?? 0}/${smsMaxLength}`}
              </Typography>
            </div>
          ) : (
            <Typography
              className={classes.textFieldLengthContent}
              variant="caption"
            >
              {`${smsContent?.length ?? 0}/${smsMaxLength}`}
            </Typography>
          )}
          {!minimalBottom && children}
        </div>
      </TextFieldWithChildren>
    </React.Fragment>
  );
};

const useStyles = makeStyles((theme) => ({
  minimalBottom: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottom: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
  },
  textFieldLengthContent: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
    alignSelf: 'flex-end',
  },
  warningContainer: {
    backgroundColor: amber[50],
    display: 'flex',
    flexDirection: 'row',
    marginRight: theme.spacing(1),
    alignSelf: 'flex-end',
    alignItems: 'center',
    borderRadius: theme.spacing(0.5),
  },
  warningIcon: {
    width: theme.spacing(2),
    height: theme.spacing(2),
    marginLeft: theme.spacing(1),
    color: theme.palette.warning.main,
  },
  warningText: {
    color: red[900],
    marginLeft: theme.spacing(2),
  },
}));

export default CommunicationWriteSMS;
