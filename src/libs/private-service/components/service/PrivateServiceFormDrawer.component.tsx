import React from 'react';
import { WithTranslation, useTranslation } from 'react-i18next';
import { Form } from 'formik';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import { compose } from 'recompose';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Submit } from '../../../../components/forms';

import PrivateServiceFields, {
  PrivateServiceFormikHOC,
} from './PrivateServiceForm.component';
import type { AssociatedEstablishment } from '#libs/establishment/types';
import type { Coach } from '#libs/associated-coach/types';
import type { PrivateService } from '#libs/private-service/types';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';

type OwnProps = {
  fullScreen: boolean;
  open: boolean;
  availableCoaches: Array<Coach>;
  availableEstablishments: Array<AssociatedEstablishment>;
  isSubmitting: boolean;
  initial?: PrivateService;
  onCancel: () => void;
};
type Props = OwnProps & WithTranslation;
export const PrivateServiceFormDrawer = (props: Props) => {
  const { t } = useTranslation('privateService');
  const classes = useStyles();
  return (
    <GenericResponsiveDrawer
      open={props.open}
      title={t('service.form.title')}
      subtitle={props.initial?.name}
      onClose={props.onCancel}
    >
      <div className={classes.container}>
        <Form>
          <PrivateServiceFields {...props} />
          <DialogActions>
            <Button onClick={props.onCancel}>
              {t('service.form.actions.cancel')}
            </Button>
            <Submit disabled={props.isSubmitting}>
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
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(20),
  },
}));
export default compose<any, OwnProps>(PrivateServiceFormikHOC)(
  PrivateServiceFormDrawer,
);
