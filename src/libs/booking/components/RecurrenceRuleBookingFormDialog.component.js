// @flow
import React from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { Form, useFormikContext } from 'formik';
import { Submit } from '../../../components/forms';
import ObjectLevelPermissionProvider from '#libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import { getActivityWorkshopPermission } from '#libs/role/permission-utils/utils';

import RecurrenceRuleBookingForm, {
  RecurrenceRuleBookingFormikHOC,
} from './RecurrenceRuleBookingForm.component';

import { MetaActivity } from '../../meta-activity/types';

type Props = {
  onClose: () => void,
  isSubmitting: boolean,
  metaActivityList: MetaActivity[],
};

export const RecurrenceRuleBookingFormDialog = (props: Props) => {
  const { t } = useTranslation('booking');
  const { values } = useFormikContext();

  return (
    <ObjectLevelPermissionProvider
      requiredPermission={[
        'reservation.activity.allowed_actions.create',
        'reservation.workshop.allowed_actions.create',
      ]}
    >
      {([
        hasActivityCreateBookingPermission,
        hasWorkshopCreateBookingPermission,
      ]) => {
        const hasCreateBookingPermission = getActivityWorkshopPermission(
          props.metaActivityList?.find(
            (metaActivity) => metaActivity.id === values.meta_activity,
          )?.is_workshop,
          hasActivityCreateBookingPermission,
          hasWorkshopCreateBookingPermission,
        );
        return (
          <Dialog open>
            <DialogTitle>{t('recurrenceRule.form.title')}</DialogTitle>
            <Form>
              <DialogContent>
                <RecurrenceRuleBookingForm
                  showCreateBookingWarning={
                    values.meta_activity && !hasCreateBookingPermission
                  }
                  {...props}
                />
              </DialogContent>
              <DialogActions>
                <Button disabled={props.isSubmitting} onClick={props.onClose}>
                  {t('recurrenceRule.actions.close')}
                </Button>
                <Submit
                  disabled={
                    props.isSubmitting ||
                    (values.meta_activity && !hasCreateBookingPermission)
                  }
                >
                  {t('recurrenceRule.actions.save')}
                </Submit>
              </DialogActions>
            </Form>
          </Dialog>
        );
      }}
    </ObjectLevelPermissionProvider>
  );
};

export default RecurrenceRuleBookingFormikHOC(RecurrenceRuleBookingFormDialog);
