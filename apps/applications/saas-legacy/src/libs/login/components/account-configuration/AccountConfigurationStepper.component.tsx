import React from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Typography } from '@material-ui/core';
import { AccountBalance, CreditCard, Description } from '@material-ui/icons';
import clsx from 'clsx';
import chroma from 'chroma-js';
import { StepManager } from '#src/libs/login/types';
import StripeIcon from '#src/components/icons/StripeIcon.component';
import SuccessIcon from '#src/components/icons/SuccessIcon.component';

export type OwnProps = {
  steps: Array<StepManager>;
  variant?: 'verticalOnMobile' | 'horizontalOnMobile';
  className?: string;
  noTitleGrey?: boolean;
};
type Props = OwnProps;
export const AccountConfigurationStepper: React.FC<Props> = ({
  variant,
  steps,
  className,
  noTitleGrey,
}) => {
  const { t } = useTranslation(['login']);
  const classes = useStyles({ variant });
  if (!steps.length) return null;
  const stripeStep = steps.findIndex(
    (stepManager) => stepManager.step === 'stripeStep',
  );
  const bankAccountStep = steps.findIndex(
    (stepManager) => stepManager.step === 'bankAccountStep',
  );
  const paymentMethodStep = steps.findIndex(
    (stepManager) => stepManager.step === 'paymentMethodStep',
  );
  const invoiceNumberingStep = steps.findIndex(
    (stepManager) => stepManager.step === 'invoiceNumberingStep',
  );
  const finalStep = steps.findIndex(
    (stepManager) => stepManager.step === 'finalStep',
  );

  return (
    <div className={clsx(classes.steps, className)}>
      {stripeStep !== -1 && (
        <>
          <div
            className={clsx(classes.box, {
              [classes.primary]: steps[stripeStep].visited,
              [classes.grey]: !steps[stripeStep].visited,
            })}
          >
            <StripeIcon
              className={clsx({
                [classes.iconPrimary]: steps[stripeStep].visited,
                [classes.icon]: !steps[stripeStep].visited,
              })}
            />
            <Typography
              className={clsx(classes.stepName, {
                [classes.opacity]: !noTitleGrey && !steps[stripeStep].visited,
              })}
              variant="subtitle2"
            >
              {t(`accountConfiguration.stripeStep`)}
            </Typography>
          </div>
        </>
      )}
      {stripeStep !== -1 &&
        (bankAccountStep !== -1 ||
          paymentMethodStep !== -1 ||
          finalStep !== -1) && <div className={classes.greyLine} />}

      {bankAccountStep !== -1 && (
        <>
          <div
            className={clsx(classes.box, {
              [classes.primary]: steps[bankAccountStep].visited,
              [classes.grey]: !steps[bankAccountStep].visited,
            })}
          >
            <AccountBalance
              className={clsx({
                [classes.iconPrimary]: steps[bankAccountStep].visited,
                [classes.icon]: !steps[bankAccountStep].visited,
              })}
            />
            <Typography
              className={clsx(classes.stepName, {
                [classes.opacity]:
                  !noTitleGrey && !steps[bankAccountStep].visited,
              })}
              variant="subtitle2"
            >
              {t(`accountConfiguration.ibanStep`)}
            </Typography>
          </div>
        </>
      )}
      {bankAccountStep !== -1 &&
        (paymentMethodStep !== -1 || finalStep !== -1) && (
          <div className={classes.greyLine} />
        )}
      {paymentMethodStep !== -1 && (
        <>
          <div
            className={clsx(classes.box, {
              [classes.primary]: steps[paymentMethodStep].visited,
              [classes.grey]: !steps[paymentMethodStep].visited,
            })}
          >
            <CreditCard
              className={clsx({
                [classes.iconPrimary]: steps[paymentMethodStep].visited,
                [classes.icon]: !steps[paymentMethodStep].visited,
              })}
            />
            <Typography
              className={clsx(classes.stepName, {
                [classes.opacity]:
                  !noTitleGrey && !steps[paymentMethodStep].visited,
              })}
              variant="subtitle2"
            >
              {t(`accountConfiguration.cardStep`)}
            </Typography>
          </div>
        </>
      )}
      {paymentMethodStep !== -1 && invoiceNumberingStep !== -1 && (
        <div className={classes.greyLine} />
      )}
      {invoiceNumberingStep !== -1 && (
        <>
          <div
            className={clsx(classes.box, {
              [classes.primary]: steps[invoiceNumberingStep].visited,
              [classes.grey]: !steps[invoiceNumberingStep].visited,
            })}
          >
            <Description
              className={clsx({
                [classes.iconPrimary]: steps[invoiceNumberingStep].visited,
                [classes.icon]: !steps[invoiceNumberingStep].visited,
              })}
            />
            <Typography
              className={clsx(classes.stepName, {
                [classes.opacity]:
                  !noTitleGrey && !steps[invoiceNumberingStep].visited,
              })}
              variant="subtitle2"
            >
              {t(`accountConfiguration.invoiceNumberingStep`)}
            </Typography>
          </div>
        </>
      )}
      {invoiceNumberingStep !== -1 && finalStep !== -1 && (
        <div className={classes.greyLine} />
      )}
      {finalStep !== -1 && (
        <div
          className={clsx(classes.box, {
            [classes.primary]: steps[finalStep].visited,
            [classes.grey]: !steps[finalStep].visited,
          })}
        >
          <SuccessIcon
            className={clsx({
              [classes.iconPrimary]: steps[finalStep].visited,
              [classes.icon]: !steps[finalStep].visited,
            })}
          />
          <Typography
            className={clsx(classes.stepName, {
              [classes.opacity]: !noTitleGrey && !steps[finalStep].visited,
            })}
            variant="subtitle2"
          >
            {t(`accountConfiguration.finishStep`)}
          </Typography>
        </div>
      )}
    </div>
  );
};
const useStyles = makeStyles<
  Theme,
  { variant: 'verticalOnMobile' | 'horizontalOnMobile' }
>((theme) => ({
  opacity: {
    opacity: '50%',
  },
  steps: ({ variant }) =>
    variant === 'horizontalOnMobile'
      ? {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: theme.spacing(5),
          [theme.breakpoints.down('xs')]: {
            paddingBottom: 'unset',
          },
        }
      : {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: theme.spacing(5),
          [theme.breakpoints.down('xs')]: {
            flexDirection: 'column',
            alignItems: 'flex-start',
            paddingBottom: 'unset',
          },
        },
  box: ({ variant }) =>
    variant === 'horizontalOnMobile'
      ? {
          position: 'relative',
          margin: theme.spacing(2),
          borderRadius: '8px',
          maxWidth: theme.spacing(7),
          width: theme.spacing(7),
          height: theme.spacing(7),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: theme.spacing(2),
          flex: '1 0',
          [theme.breakpoints.down('xs')]: {
            margin: '4px',
            maxWidth: theme.spacing(6),
            width: theme.spacing(6),
            height: theme.spacing(6),
            padding: theme.spacing(1),
          },
        }
      : {
          position: 'relative',
          margin: theme.spacing(2),
          borderRadius: '8px',
          maxWidth: theme.spacing(7),
          width: theme.spacing(7),
          height: theme.spacing(7),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: theme.spacing(2),
          flex: '1 0',
          [theme.breakpoints.down('xs')]: {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
          },
        },
  primary: {
    backgroundColor: chroma(theme.palette.primary.main).alpha(0.2).hex(),
  },
  iconPrimary: {
    fill: theme.palette.primary.main,
  },
  icon: {
    fill: '#C4C4C4',
  },
  stepName: ({ variant }) =>
    variant === 'horizontalOnMobile'
      ? {
          position: 'absolute',
          top: theme.spacing(8),
          textAlign: 'center',
          width: theme.spacing(15),
          [theme.breakpoints.down('xs')]: {
            display: 'none',
          },
        }
      : {
          position: 'absolute',
          top: theme.spacing(8),
          textAlign: 'center',
          width: theme.spacing(14),
          [theme.breakpoints.down('xs')]: {
            width: theme.spacing(25),
            top: '25%',
            left: theme.spacing(10),
            textAlign: 'unset',
          },
        },
  greyLine: ({ variant }) =>
    variant === 'horizontalOnMobile'
      ? {
          maxWidth: theme.spacing(10),
          height: '2px',
          backgroundColor: '#C4C4C4',
          flex: '1 1',
        }
      : {
          maxWidth: theme.spacing(10),
          height: '2px',
          flex: '1 1',
          backgroundColor: '#C4C4C4',
          [theme.breakpoints.down('xs')]: {
            display: 'none',
          },
        },
  grey: {
    backgroundColor: '#8686861A',
  },
}));

AccountConfigurationStepper.defaultProps = {
  variant: 'horizontalOnMobile',
};
export default AccountConfigurationStepper;
