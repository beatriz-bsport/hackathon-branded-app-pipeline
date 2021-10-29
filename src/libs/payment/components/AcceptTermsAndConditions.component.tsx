import React from 'react';
import { compose, withStateHandlers } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';

import ButtonBase from '@material-ui/core/ButtonBase';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Checkbox from '@material-ui/core/Checkbox';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import { FormControlLabel } from '@material-ui/core';

import TypographyMultiline from '../../../components/TypographyMultiline.component';
import { MaterialStyleType, WithHandlerType } from '../../../utils/types';

type OwnProps = {
  accepted: boolean;
  onChecked: (accepted: boolean) => void;
  required?: boolean;
  termsAndConditions: string;
  type: 'generalTermsOfUse' | 'theTermsAndConditions' | 'waiver';
};

type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;

type Props = OwnProps &
  StateHandlerType &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

export const AcceptTermsAndConditions = (props: Props) => {
  return (
    <div className={props.classes.container}>
      <FormControlLabel
        control={
          <Checkbox
            required={props.required}
            checked={props.accepted}
            onChange={(ev) => props.onChecked(ev.target.checked)}
          />
        }
        label={
          <Typography
            component="div"
            variant="caption"
            className={props.classes.termsAndConditions}
          >
            <span>{props.t('generalTermsAndConditions.iAccept')}</span>
            <ButtonBase
              onClick={() => props.setShowTermsAndConditions(true)}
              className={props.classes.terms}
            >
              <Typography variant="caption" color="secondary">
                {props.t(`generalTermsAndConditions.${props.type}`)}
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

const styles = () => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  termsAndConditions: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  terms: {
    paddingLeft: '4px',
  },
});

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
  // @ts-ignore
  withStyles(styles),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
)(AcceptTermsAndConditions);
