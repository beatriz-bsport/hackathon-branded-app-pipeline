import React from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import AlertIcon from '@material-ui/icons/Warning';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { Redirect } from 'react-router-dom';
import DialogActions from '@material-ui/core/DialogActions';

import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import CheckPermission from '../../libs/role/components/CheckPermission.component';

type Props = {
  paymentMethodMissing: boolean;
};

const BillingBanner = (props: Props) => {
  const { t } = useTranslation(['navigation']);
  const classes = useStyles();

  const [modalOpen, setModalOpen] = React.useState(false);
  const [shouldRedirect, setShouldRedirect] = React.useState(false);
  const [counter, setCounter] = React.useState(6);
  const decrementCounter = () => {
    setTimeout(() => setCounter(5), 1000);
    setTimeout(() => setCounter(4), 2000);
    setTimeout(() => setCounter(3), 3000);
    setTimeout(() => setCounter(2), 4000);
    setTimeout(() => setCounter(1), 5000);
    setTimeout(() => setCounter(0), 6000);
  };
  React.useEffect(() => {
    if (props.paymentMethodMissing) {
      setTimeout(() => {
        setModalOpen(true);
        decrementCounter();
      }, 1000 * 60 * 45);
    }
  }, [props.paymentMethodMissing]);
  if (!props.paymentMethodMissing) return null;

  if (shouldRedirect) {
    return <Redirect to="/settings/platform-billing" />;
  }

  return (
    <div className={classes.paymentMissingContainer}>
      <ButtonBase
        onClick={() => {
          document.location.pathname = '/settings/platform-billing';
        }}
        className={classes.errorBanner}
      >
        <div className={classes.text}>
          <AlertIcon fontSize="small" />
          <Typography align="left" variant="caption">
            {t('paymentMethodMissing.banner')}
          </Typography>
        </div>
      </ButtonBase>
      <CheckPermission requiredPermissions="navigationMenu.settings">
        {!window.location.pathname.includes('settings') && (
          <Dialog open={modalOpen}>
            <div className={classes.dialogContent}>
              <Typography>{t('paymentMethodMissing.explain')}</Typography>
            </div>
            <DialogActions>
              <Button
                color="primary"
                disabled={counter > 0}
                onClick={() => {
                  setModalOpen(false);
                  setShouldRedirect(true);
                }}
              >
                {counter > 0 && `(${counter}) `}
                {t('paymentMethodMissing.closeModal')}
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </CheckPermission>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    padding: theme.spacing(2),
  },
  paymentMissingContainer: {
    left: 0,
    right: 0,
    marginLeft: theme.spacing(-3),
    marginRight: theme.spacing(-3),
    marginTop: theme.spacing(-2),
    paddingBottom: theme.spacing(2),
    zIndex: 999,
  },
  errorBanner: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.error.dark,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  text: {
    color: '#FEFEFE',
    fontSize: 14,
    alignItems: 'center',
    flexDirection: 'row',
    display: 'flex',
    padding: theme.spacing(1) / 4,
    '&>*': {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  },
}));

export default BillingBanner;
