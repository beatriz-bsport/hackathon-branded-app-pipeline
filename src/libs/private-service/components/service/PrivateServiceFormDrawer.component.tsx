import React from 'react';
import { WithTranslation, useTranslation } from 'react-i18next';
import { Form } from 'formik';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import { compose } from 'recompose';
import makeStyles from '@material-ui/core/styles/makeStyles';

// @ts-expect-error
import { Submit } from '../../../../components/forms';

import PrivateServiceFields, {
  PrivateServiceFormikHOC,
} from './PrivateServiceForm.component';
import type { AssociatedEstablishment } from '#libs/establishment/types';
import type { Coach } from '#libs/associated-coach/types';
import type { PrivateService } from '#libs/private-service/types';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';
import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';

const { trackFormSubmitIntent, trackFormAdd, trackFormCancel } =
  rudderStackFormTrackingFunctionsRegistry(
    SegmentAnalyticsFormObjectIdentifier.PrivateService,
  );
type OwnProps = {
  fullScreen: boolean;
  open: boolean;
  availableCoaches: Array<Coach>;
  availableEstablishments: Array<AssociatedEstablishment>;
  allEstablishments: Array<AssociatedEstablishment>;
  isSubmitting: boolean;
  initial?: PrivateService;
  onCancel: () => void;
};
type Props = OwnProps & WithTranslation;
export const PrivateServiceFormDrawer = (props: Props) => {
  const { t } = useTranslation('privateService');
  const classes = useStyles();
  const { onCancel, initial } = props;
  const cancel = React.useCallback(() => {
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
      onClose={cancel}
      open={props.open}
      subtitle={props.initial?.name}
      title={t('service.form.title')}
    >
      <div className={classes.container}>
        <Form>
          {/* @ts-expect-error */}
          <PrivateServiceFields {...props} />
          <DialogActions>
            <Button onClick={cancel}>{t('service.form.actions.cancel')}</Button>
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
