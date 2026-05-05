import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Button, Typography } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';

import TimeoutButton from '#src/components/button/TimeoutButton.component';
import {
  APPLE_BUSINESS_URL,
  getAppleDeveloperProgramGuideUrl,
} from '#src/libs/constants';
import { AdpModalKind } from '#src/libs/settings/types';
import { getCurrentLanguageIsoCode } from '#src/utils/language';
import { openIntercomConversation } from '#src/utils/intercom';

type OwnProps = {
  cancel?: () => void;
  kind?: AdpModalKind;
};

const APPLE_DEVELOPER_PROGRAM_DIALOG_CANCEL_TIMEOUT = 10; // Seconds

export const AppleDeveloperProgramDialog: React.FC<OwnProps> = ({
  cancel,
  kind = AdpModalKind.MIGRATION,
}) => {
  const { t, i18n } = useTranslation(['b2b_adpModal', 'common']);
  const classes = useStyles();
  const playbookUrl = getAppleDeveloperProgramGuideUrl(
    getCurrentLanguageIsoCode(i18n.language),
  );

  const getContent = () => {
    if (kind === AdpModalKind.MIGRATION) {
      return (
        <>
          <div className={classes.title}>
            <WarningIcon className={classes.warningIcon} color="error" />
            <Typography variant="h5">
              {t('b2b_adpModal:appleDeveloperProgram.alert.title')}
            </Typography>
          </div>
          <Typography className={classes.paragraph}>
            <Trans
              components={[<strong key="strong" />]}
              i18nKey="b2b_adpModal:appleDeveloperProgram.alert.paragraph1"
            />
          </Typography>
          <Typography className={classes.paragraph}>
            <Trans
              components={[
                <a
                  key="playbook"
                  className={classes.link}
                  href={playbookUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                />,
              ]}
              i18nKey="b2b_adpModal:appleDeveloperProgram.alert.paragraph2"
            />
          </Typography>
          <Typography className={classes.paragraph}>
            <Trans
              components={[
                <a
                  key="email"
                  className={classes.link}
                  href="mailto:support@bsport.io"
                />,
              ]}
              i18nKey="b2b_adpModal:appleDeveloperProgram.alert.paragraph3"
            />
          </Typography>
          <div className={classes.actions}>
            <div className={classes.actionsEnd}>
              {cancel && (
                <TimeoutButton
                  delayBeforeActivation={
                    APPLE_DEVELOPER_PROGRAM_DIALOG_CANCEL_TIMEOUT
                  }
                  onClick={cancel}
                >
                  {t('common:close')}
                </TimeoutButton>
              )}
              <Button
                color="primary"
                onClick={openIntercomConversation}
                variant="contained"
              >
                {t('b2b_adpModal:appleDeveloperProgram.alert.contactUs')}
              </Button>
            </div>
          </div>
        </>
      );
    }
    if (kind === AdpModalKind.PENDING_AGREEMENTS) {
      return (
        <>
          <div className={classes.title}>
            <WarningIcon className={classes.warningIcon} color="error" />
            <Typography variant="h5">
              {t('b2b_adpModal:pendingAgreements.alert.title')}
            </Typography>
          </div>
          <Typography className={classes.paragraph}>
            <Trans
              components={[<strong key="strong" />]}
              i18nKey="b2b_adpModal:pendingAgreements.alert.paragraph1"
            />
          </Typography>
          <Typography className={classes.paragraph}>
            <Trans i18nKey="b2b_adpModal:pendingAgreements.alert.paragraph2" />
          </Typography>
          <Typography className={classes.paragraph}>
            <Trans
              components={[
                <strong key="strong" />,
                <a
                  key="appleBusiness"
                  className={classes.link}
                  href={APPLE_BUSINESS_URL}
                  rel="noopener noreferrer"
                  target="_blank"
                />,
              ]}
              i18nKey="b2b_adpModal:pendingAgreements.alert.paragraph3"
            />
          </Typography>
          <Typography className={classes.paragraph}>
            <Trans
              components={[<strong key="strong" />]}
              i18nKey="b2b_adpModal:pendingAgreements.alert.paragraph4"
            />
          </Typography>
          <Typography className={classes.paragraph}>
            <Trans
              components={[<strong key="strong" />]}
              i18nKey="b2b_adpModal:pendingAgreements.alert.paragraph5"
            />
          </Typography>
          <div className={classes.actions}>
            <div className={classes.actionsEnd}>
              {cancel && (
                <TimeoutButton
                  delayBeforeActivation={
                    APPLE_DEVELOPER_PROGRAM_DIALOG_CANCEL_TIMEOUT
                  }
                  onClick={cancel}
                >
                  {t('common:close')}
                </TimeoutButton>
              )}
              <Button
                color="primary"
                onClick={() =>
                  window.open(APPLE_BUSINESS_URL, '_blank', 'noopener')
                }
                variant="contained"
              >
                {t('b2b_adpModal:pendingAgreements.alert.goToApple')}
              </Button>
            </div>
          </div>
        </>
      );
    }

    return null;
  };

  return getContent();
};

const useStyles = makeStyles<Theme>((theme) => ({
  title: {
    padding: theme.spacing(4),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  warningIcon: { flexShrink: 0, color: theme.palette.warning.main },
  paragraph: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  link: {
    color: theme.palette.primary.main,
    fontWeight: 700,
    textDecoration: 'underline',
    '&:hover': { color: theme.palette.primary.dark },
  },
  actions: {
    padding: theme.spacing(4),
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    gap: theme.spacing(1),
  },
  actionsEnd: {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: theme.spacing(1),
  },
}));

export default AppleDeveloperProgramDialog;
