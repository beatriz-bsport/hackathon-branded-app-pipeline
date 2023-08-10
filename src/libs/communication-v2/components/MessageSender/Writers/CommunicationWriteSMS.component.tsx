import React from 'react';
import { useTranslation } from 'react-i18next';

import { Theme, makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { ReportProblemOutlined as WarningIcon } from '@material-ui/icons';
import { amber, red } from '@material-ui/core/colors';

import TextFieldWithChildren from '#components/input/text-field/TextFieldWithChildren';
import { MAX_LENGTH_SMS } from '#libs/communication-v2/constants';

type Props = {
  children: any;
  handleChangeContent: (event: React.ChangeEvent) => void;
  isMobileSize?: boolean;
  onFocus: () => void;
  smsContent: string;
};

const CommunicationWriteSMS = (props: Props) => {
  const { t } = useTranslation('communication');
  const classes = useStyles();
  const { handleChangeContent, onFocus, smsContent, isMobileSize } = props;
  const nbSmsToSend = Math.ceil(smsContent?.length / MAX_LENGTH_SMS);
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
        {nbSmsToSend > 1 ? (
          <div className={classes.warningContainer}>
            <WarningIcon className={classes.warningIcon} />
            <Typography className={classes.warningText} variant="caption">
              {t('sendMessage.textField.warningLength', {
                number_sms: nbSmsToSend,
              })}
            </Typography>
            <Typography className={classes.warningText} variant="caption">
              {`${smsContent?.length ?? 0}/${MAX_LENGTH_SMS}`}
            </Typography>
          </div>
        ) : (
          <Typography
            className={classes.textFieldLengthContent}
            variant="caption"
          >
            {`${smsContent?.length ?? 0}/${MAX_LENGTH_SMS}`}
          </Typography>
        )}
        {props.children}
      </TextFieldWithChildren>
    </React.Fragment>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
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
