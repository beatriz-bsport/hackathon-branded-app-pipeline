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
import { CheckoutContext } from '../../../pages/checkout/basket/CheckoutContext';
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
  const isNewCheckoutFlow = React.useContext(CheckoutContext);
  const classes = useStyles({ isNewCheckoutFlow });

  return (
    <div className={classes.container}>
      <FormControlLabel
        control={
          <Checkbox
            required={props.required}
            checked={props.accepted}
            onChange={(ev) => props.onChecked(ev.target.checked)}
            disabled={props.disabled}
          />
        }
        label={
          <Typography
            component="div"
            variant={isNewCheckoutFlow ? 'body1' : 'caption'}
            align="left"
          >
            {!props.label && (
              <span>{props.t('generalTermsAndConditions.iAccept')}</span>
            )}
            <ButtonBase onClick={() => props.setShowTermsAndConditions(true)}>
              <Typography
                variant={isNewCheckoutFlow ? 'body1' : 'caption'}
                color={isNewCheckoutFlow ? 'primary' : 'secondary'}
                align="left"
              >
                {props.label ||
                  props.t(`generalTermsAndConditions.${props.type}`)}
              </Typography>
            </ButtonBase>
          </Typography>
        }
      />
      <Dialog
        open={props.showTermsAndConditions}
        onClose={() => props.setShowTermsAndConditions(false)}
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
type NewCheckoutFlowThemeProps = {
  isNewCheckoutFlow?: boolean;
};

const useStyles = makeStyles<Theme, NewCheckoutFlowThemeProps>((theme) => ({
  container: ({ isNewCheckoutFlow }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    ...(isNewCheckoutFlow ? { marginLeft: theme.spacing(2) } : {}),
  }),
  termsAndConditions: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  terms: {
    paddingLeft: '4px',
  },
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
