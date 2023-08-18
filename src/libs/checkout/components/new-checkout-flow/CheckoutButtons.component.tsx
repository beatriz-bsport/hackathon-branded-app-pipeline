import React from 'react';
import { useTranslation } from 'react-i18next';

import Info from '@material-ui/icons/Info';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import grey from '@material-ui/core/colors/grey';
import UpdateIcon from '@material-ui/icons/Update';
import { makeStyles, Theme, isWidthDown } from '@material-ui/core';
import PopOver from '#components/Popover';
import { SUBMIT_BUTTONS } from '#libs/checkout/types';
import { useWidth } from '../../../../hooks/useWidth';

type CheckoutButtonsProps = {
  handleSubmitButtonsCallbacks: {
    [key: number]: (event: React.MouseEvent<any>) => Promise<void>;
  };
  submitButtonsDisabledState: { [key: number]: boolean };
  submitButtonsDisplayableState: { [key: number]: boolean };
  submitButtonsProcessingState: { [key: number]: boolean };
};

export const CheckoutButtons: React.FC<CheckoutButtonsProps> = ({
  handleSubmitButtonsCallbacks,
  submitButtonsDisabledState,
  submitButtonsDisplayableState,
  submitButtonsProcessingState,
}) => {
  const width = useWidth();
  const isMobile = isWidthDown('sm', width);
  const classes = useStyles();
  const { t } = useTranslation('checkout');
  const [isPayLaterInfoDisplayed, setIsPayLaterInfoDisplayed] =
    React.useState(false);

  const OnInfoRequest = React.useCallback(
    () => setIsPayLaterInfoDisplayed(!isPayLaterInfoDisplayed),
    [isPayLaterInfoDisplayed],
  );

  return (
    <div className={classes.buttonsContainer}>
      {[
        SUBMIT_BUTTONS.NEXT_BUTTON,
        SUBMIT_BUTTONS.PAY_NOW_BUTTON,
        SUBMIT_BUTTONS.CONFIRM_BUTTON,
      ].map((button) => (
        <>
          {submitButtonsDisplayableState[button.id] && (
            <Button
              key={button.id}
              className={classes.submitButton}
              disabled={
                submitButtonsDisabledState[button.id] ||
                submitButtonsProcessingState[button.id]
              }
              onClick={handleSubmitButtonsCallbacks[button.id]}
              variant="outlined"
            >
              {submitButtonsProcessingState[button.id] && (
                <CircularProgress
                  color="inherit"
                  size={24}
                  style={{ marginRight: 8 }}
                />
              )}
              {t(button.textPath)}
            </Button>
          )}
        </>
      ))}
      {submitButtonsDisplayableState[SUBMIT_BUTTONS.PAY_LATER_BUTTON.id] && (
        <div>
          <div className={classes.payLaterContainer}>
            <Button
              className={classes.payLaterButton}
              disabled={
                submitButtonsDisabledState[
                  SUBMIT_BUTTONS.PAY_LATER_BUTTON.id
                ] ||
                submitButtonsProcessingState[SUBMIT_BUTTONS.PAY_LATER_BUTTON.id]
              }
              onClick={
                handleSubmitButtonsCallbacks[SUBMIT_BUTTONS.PAY_LATER_BUTTON.id]
              }
              variant="outlined"
            >
              {submitButtonsProcessingState[
                SUBMIT_BUTTONS.PAY_LATER_BUTTON.id
              ] && (
                <CircularProgress
                  color="inherit"
                  size={24}
                  style={{ marginRight: 8 }}
                />
              )}
              <UpdateIcon className={classes.iconLeft} />
              {t(SUBMIT_BUTTONS.PAY_LATER_BUTTON.textPath)}
            </Button>
            {isMobile ? (
              <IconButton onClick={OnInfoRequest}>
                <Info />
              </IconButton>
            ) : (
              <div className={classes.payLaterInfoContainer}>
                <PopOver
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                  className={classes.payLaterText}
                  title={t('payLater.explain')}
                  transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                  <Info className={classes.infoIcon} />
                </PopOver>
              </div>
            )}
          </div>
          <div>
            {isMobile && isPayLaterInfoDisplayed && (
              <div className={classes.greyContainer}>
                {t('payLater.explain')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => {
  return {
    buttonsContainer: {
      boxSizing: 'border-box',
      borderStyle: 'solid',
      borderWidth: '0 1px 1px 1px',
      borderColor: theme.palette.grey[100],
      borderRadius: '0 0 12px 12px',
      display: 'flex',
      flexDirection: 'column',
      [theme.breakpoints.down('sm')]: {
        boxSizing: 'content-box',
        borderWidth: '0px',
      },
    },
    infoIcon: { color: theme.palette.grey[600] },
    iconLeft: {
      marginRight: theme.spacing(1),
    },
    payLaterButton: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
      borderRadius: theme.spacing(3),
      borderColor: theme.palette.primary.main,
      background: theme.palette.background.paper,
      flex: 1,
      color: theme.palette.primary.main,
    },
    payLaterContainer: {
      display: 'flex',
      flexDirection: 'row',
      margin: `0 ${theme.spacing(2)}px ${theme.spacing(2)}px ${theme.spacing(
        2,
      )}px`,
      gap: theme.spacing(1),
      alignItems: 'center',
      [theme.breakpoints.down('sm')]: {
        margin: ` 0 0 ${theme.spacing(2)}px 0`,
      },
    },
    payLaterInfoContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      '&:hover': {
        backgroundColor: theme.palette.grey[100],
        borderRadius: theme.spacing(1),
      },
    },
    payLaterText: {
      maxWidth: '250px',
      fontWeight: 500,
      fontSize: '10px',
      lineHeight: '14px',
    },
    submitButton: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
      margin: ` 0 ${theme.spacing(2)}px ${theme.spacing(2)}px ${theme.spacing(
        2,
      )}px`,
      borderRadius: theme.spacing(3),
      borderColor: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      '&:disabled': {
        background: theme.palette.grey[100],
        borderColor: theme.palette.grey[100],
        color: theme.palette.grey[400],
      },
      '&:hover': {
        background: theme.palette.grey[100],
        borderColor: theme.palette.grey[100],
        color: theme.palette.grey[400],
      },
      [theme.breakpoints.down('sm')]: {
        margin: ` 0 0 ${theme.spacing(2)}px 0`,
      },
    },
    greyContainer: {
      backgroundColor: grey[100],
      borderRadius: theme.spacing(1.5),
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  };
});

export default React.memo(CheckoutButtons);
