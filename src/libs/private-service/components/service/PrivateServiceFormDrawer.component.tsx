import React from 'react';
import { WithTranslation, useTranslation } from 'react-i18next';
import { Form, FormikProps } from 'formik';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import { compose } from 'recompose';
import makeStyles from '@material-ui/core/styles/makeStyles';

import type { AssociatedEstablishment } from '#src/libs/establishment/types';
import type { Coach } from '#src/libs/associated-coach/types';
import type { PrivateService } from '#src/libs/private-service/types';
import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
import PrivateServiceFields, {
  PrivateServiceFormikHOC,
  type FormikValues,
} from './PrivateServiceForm.component';

import DisablePrivateServiceOwnSlotsDialog from '#src/libs/private-service/components/service/DisablePrivateServiceOwnSlotsDialog';

const { trackFormSubmitIntent, trackFormAdd, trackFormCancel } =
  rudderStackFormTrackingFunctionsRegistry(
    SegmentAnalyticsFormObjectIdentifier.PrivateService,
  );

type OwnProps = {
  isIntegratedWithClassPass: boolean;
  fullScreen: boolean;
  open: boolean;
  availableCoaches: Array<Coach>;
  availableEstablishments: Array<AssociatedEstablishment>;
  allEstablishments: Array<AssociatedEstablishment>;
  isSubmitting: boolean;
  initial?: PrivateService | PrivateService<Coach, AssociatedEstablishment>;
  onCancel: () => void;
  onTransitionEnd?: () => void;
};

type Props = OwnProps & WithTranslation & FormikProps<FormikValues>;

export const PrivateServiceFormDrawer = (props: Props) => {
  const { t } = useTranslation('privateService');
  const classes = useStyles();
  const {
    onCancel,
    initial,
    onTransitionEnd,
    values,
    handleSubmit,
    setFieldValue,
    errors,
  } = props;

  const [
    isConfirmDisablePrivateServiceOwnSlots,
    setIsConfirmDisablePrivateServiceOwnSlots,
  ] = React.useState(false);

  const handleClose = React.useCallback(() => {
    onCancel();
    trackFormCancel(initial?.id);
  }, [onCancel, initial?.id]);

  const onClickDialogDoItLater = React.useCallback(() => {
    handleSubmit();
    setIsConfirmDisablePrivateServiceOwnSlots(false);
  }, [handleSubmit]);

  const onClickSave = React.useCallback(() => {
    trackFormSubmitIntent(initial?.id);
    if (
      // Adding the erros check to not open the dialog if the fields are not valid
      Object.keys(errors).length === 0 &&
      values.available_on_partnership &&
      values.has_own_availability_slots
    ) {
      setIsConfirmDisablePrivateServiceOwnSlots(true);
    } else {
      handleSubmit();
    }
  }, [
    values.available_on_partnership,
    values.has_own_availability_slots,
    initial?.id,
    handleSubmit,
    errors,
  ]);

  const handleConfirmDisableAvailabilitySlots = React.useCallback(async () => {
    setFieldValue('has_own_availability_slots', false);
    handleSubmit();
    setIsConfirmDisablePrivateServiceOwnSlots(false);
  }, [setFieldValue, handleSubmit]);

  React.useEffect(() => {
    if (props.open) {
      trackFormAdd(props.initial?.id);
    }
  }, [props.initial?.id, props.open]);

  return (
    <GenericResponsiveDrawer
      onClose={handleClose}
      onTransitionEnd={onTransitionEnd}
      open={props.open}
      subtitle={props.initial?.name}
      title={t('service.form.title')}
    >
      <div className={classes.container}>
        <Form>
          {/* @ts-expect-error */}
          <PrivateServiceFields {...props} />
          <DialogActions>
            <Button onClick={handleClose}>
              {t('service.form.actions.cancel')}
            </Button>
            <Button
              color="primary"
              disabled={props.isSubmitting}
              onClick={onClickSave}
              variant="contained"
            >
              {t('service.form.actions.submit')}
            </Button>
          </DialogActions>
        </Form>
        <DisablePrivateServiceOwnSlotsDialog
          isOpen={isConfirmDisablePrivateServiceOwnSlots}
          isSubmitting={props.isSubmitting}
          onDoItLater={onClickDialogDoItLater}
          onSubmit={handleConfirmDisableAvailabilitySlots}
        />
      </div>
    </GenericResponsiveDrawer>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(20),
  },
}));

export default compose<any, OwnProps>(PrivateServiceFormikHOC)(
  PrivateServiceFormDrawer,
);
