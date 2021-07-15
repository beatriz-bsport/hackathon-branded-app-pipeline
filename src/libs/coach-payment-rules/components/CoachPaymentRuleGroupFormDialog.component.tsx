import React from 'react';

import { compose } from 'recompose';

import { withTranslation, WithTranslation } from 'react-i18next';
import { Form } from 'formik';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import IconButton from '@material-ui/core/IconButton';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Submit } from '../../../components/forms';

import CoachPaymentRuleFormGroupFields, {
  CoachPaymentRuleGroupFormHOC,
} from './coach-payment-rule-group-form/CoachPaymentRuleGroupForm.component';

type OwnProps = {
  open: boolean;
  handleClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  toogleFullsScreenDialog: () => void;
  openFullScreenDialog: boolean;
};
type Props = OwnProps & WithTranslation & {};
export function CoachPaymentRuleGroupFormDialog(props: Props) {
  const { t, open, handleClose, isSubmitting } = props;
  const [openFullScreenDialog, setOpenFullScreenDialog] = React.useState(false);
  const toogleFullsScreenDialog = () =>
    setOpenFullScreenDialog(!openFullScreenDialog);
  return (
    <Dialog
      fullWidth={!openFullScreenDialog}
      fullScreen={openFullScreenDialog}
      maxWidth="md"
      open={open}
      onClose={handleClose}
      disableBackdropClick
      disableEscapeKeyDown
    >
      <Form>
        {openFullScreenDialog ? (
          <AppBar
            style={{
              position: 'relative',
              marginBottom: 10,
              backgroundColor: 'white',
            }}
          >
            <Toolbar
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h5">
                  {t('coach_payment_rule_groups.dialogTitle')}
                </Typography>
                <IconButton onClick={toogleFullsScreenDialog}>
                  {openFullScreenDialog ? (
                    <FullscreenExitIcon />
                  ) : (
                    <FullscreenIcon />
                  )}
                </IconButton>
              </div>
              <div>
                <Button
                  onClick={handleClose}
                  color="secondary"
                  disabled={isSubmitting}
                >
                  {t('cancel')}
                </Button>
                <Submit
                  id="button_coach_remuneration_save"
                  disabled={isSubmitting}
                >
                  {t('save')}
                </Submit>
              </div>
            </Toolbar>
          </AppBar>
        ) : (
          <DialogTitle id="form-dialog-title">
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {t('coach_payment_rule_groups.dialogTitle')}
              {/* <IconButton onClick={toogleFullsScreenDialog}>
                {openFullScreenDialog ? (
                  <FullscreenExitIcon />
                ) : (
                  <FullscreenIcon />
                )}
              </IconButton> */}
            </div>
          </DialogTitle>
        )}
        <DialogContent>
          <CoachPaymentRuleFormGroupFields
            {...props}
            toogleFullsScreenDialog={toogleFullsScreenDialog}
            openFullScreenDialog={openFullScreenDialog}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="secondary"
            disabled={isSubmitting}
          >
            {t('cancel')}
          </Button>
          <Submit id="button_coach_remuneration_save" disabled={isSubmitting}>
            {t('save')}
          </Submit>
        </DialogActions>
      </Form>
    </Dialog>
  );
}

export default compose<any, OwnProps>(
  withTranslation(['paymentRules']),
  CoachPaymentRuleGroupFormHOC,
)(CoachPaymentRuleGroupFormDialog);
