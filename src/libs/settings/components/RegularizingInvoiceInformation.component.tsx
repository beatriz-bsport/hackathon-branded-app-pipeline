import React from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Button, IconButton, Typography } from '@material-ui/core';
import TimeoutButton from '#components/button/TimeoutButton.component';
import InfoBox from '#components/box/InfoBox.component';
import IntercomIcon from '#components/icons/IntercomIcon.component';

type OwnProps = {
  goNext: () => void;
  cancel: () => void;
  contactSupport: () => void;
};
type Props = OwnProps;
export const RegularizingInvoiceInformation: React.FC<Props> = ({
  goNext,
  contactSupport,
  cancel,
}) => {
  const { t } = useTranslation(['login', 'common']);
  const classes = useStyles();
  return (
    <>
      <Typography variant="h5" className={classes.title}>
        {t('regularizeInvoice.needPaymentMethod')}
      </Typography>
      <Typography className={classes.content}>
        {t('regularizeInvoice.needPaymentMethodContent')}
      </Typography>
      <InfoBox
        className={classes.infoBox}
        variant="outlined"
        content={t('login:accountConfiguration.needToConfigureStripeInfo')}
      />

      <div className={classes.actions}>
        <div className={classes.actionsStart}>
          {contactSupport && (
            <IconButton
              color="primary"
              className={classes.intercomButton}
              disableRipple
              id="intercomIcon"
              onClick={contactSupport}
            >
              <IntercomIcon className={classes.intercomIcon} />
            </IconButton>
          )}
        </div>
        <div className={classes.actionsEnd}>
          {cancel && (
            <TimeoutButton delayBeforeActivation={15} onClick={cancel}>
              {t('common:close')}
            </TimeoutButton>
          )}
          <Button onClick={goNext} color="primary" variant="contained">
            {t('regularizeInvoice.actionRegularize')}
          </Button>
        </div>
      </div>
    </>
  );
};

const useStyles = makeStyles<Theme>((theme) => ({
  infoBox: { margin: theme.spacing(4), marginBottom: '0' },

  intercomButton: {
    backgroundColor: theme.palette.primary.main,
    width: theme.spacing(7),
    height: theme.spacing(7),
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  title: { padding: theme.spacing(4) },
  intercomIcon: { fill: 'white', width: '26px', height: '30px' },
  content: { paddingLeft: theme.spacing(4), paddingRight: theme.spacing(4) },
  actions: {
    padding: theme.spacing(4),
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    gap: theme.spacing(1),
  },
  actionsStart: {
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'center',
    flex: '0',
  },
  actionsEnd: {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: theme.spacing(1),
  },
}));
export default RegularizingInvoiceInformation;
