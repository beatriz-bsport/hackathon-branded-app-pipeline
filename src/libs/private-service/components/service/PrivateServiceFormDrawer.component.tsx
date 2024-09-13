import React from 'react';
import { WithTranslation, useTranslation } from 'react-i18next';
import { Form } from 'formik';
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
} from './PrivateServiceForm.component';
// @ts-expect-error
import { Submit } from '../../../../components/forms';

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
type Props = OwnProps & WithTranslation;
export const PrivateServiceFormDrawer = (props: Props) => {
  const { t } = useTranslation('privateService');
  const classes = useStyles();
  const { onCancel, initial, onTransitionEnd } = props;
  const handleClose = React.useCallback(() => {
    onCancel();
    trackFormCancel(initial?.id);
  }, [onCancel, initial?.id]);

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
            <Submit
              disabled={props.isSubmitting}
              onClick={() => {
                trackFormSubmitIntent(props.initial?.id);
              }}
            >
              {t('service.form.actions.submit')}
            </Submit>
          </DialogActions>
        </Form>
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
