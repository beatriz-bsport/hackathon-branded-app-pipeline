import React from 'react';
import { compose, withStateHandlers } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';

import { makeStyles, FormControlLabel, Theme } from '@material-ui/core';
import ButtonBase from '@material-ui/core/ButtonBase';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

import TypographyMultiline from '../../../components/typo/TypographyMultiline.component';
import { WithHandlerType } from '../../../utils/types';
import CheckoutContext from '../../../pages/checkout/basket/CheckoutContext';
import { TermsAndConditionType } from '../types';

type OwnProps = {
  accepted: boolean;
  onChecked: (accepted: boolean) => void;
  required?: boolean;
  termsAndConditions: string;
  type: TermsAndConditionType;
  disabled?: boolean;
  label?: string;
};

type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;

type Props = OwnProps & StateHandlerType & WithTranslation;

export const AcceptTermsAndConditions = (props: Props) => {
  const isCheckoutContext = React.useContext(CheckoutContext);
  const classes = useStyles({ isCheckoutContext });

  return (
    <div className={classes.container}>
      <FormControlLabel
        control={
          <Checkbox
            checked={props.accepted}
            classes={{ root: classes.checkbox, checked: classes.checked }}
            disabled={props.disabled}
            onChange={(ev) => props.onChecked(ev.target.checked)}
            required={props.required}
          />
        }
        label={
          <Typography
            align="left"
            component="div"
            variant={isCheckoutContext ? 'body1' : 'caption'}
          >
            {!props.label && (
              <span>{props.t('generalTermsAndConditions.iAccept')}</span>
            )}
            <ButtonBase onClick={() => props.setShowTermsAndConditions(true)}>
              <Typography
                align="left"
                color={isCheckoutContext ? 'primary' : 'secondary'}
                variant={isCheckoutContext ? 'body1' : 'caption'}
              >
                {props.label ||
                  props.t(`generalTermsAndConditions.${props.type}`)}
              </Typography>
            </ButtonBase>
          </Typography>
        }
      />
      <Dialog
        onClose={() => props.setShowTermsAndConditions(false)}
        open={props.showTermsAndConditions}
      >
        <DialogContent>
          <TypographyMultiline>{props.termsAndConditions}</TypographyMultiline>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.setShowTermsAndConditions(false)}>
            {props.t('generalTermsAndConditions.close')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
type CheckoutContextThemeProps = {
  isCheckoutContext?: boolean;
};

const useStyles = makeStyles<Theme, CheckoutContextThemeProps>((theme) => ({
  container: ({ isCheckoutContext }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    // this value of padding left is to compensate for the root marginLeft of FormControlLabel
    ...(isCheckoutContext ? { paddingLeft: theme.spacing(1.375) } : {}),
  }),
  termsAndConditions: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  terms: {
    paddingLeft: '4px',
  },
  checkbox: {
    '&$checked': {
      color: theme.palette.primary.main,
    },
  },
  checked: {},
}));

const withStateHandlersInit = {
  showTermsAndConditions: false,
};

const withStateHandlersSetter = {
  setShowTermsAndConditions: () => (showTermsAndConditions: boolean) => {
    return { showTermsAndConditions };
  },
};

export default compose<any, OwnProps>(
  withTranslation(['payment']),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
)(AcceptTermsAndConditions);
