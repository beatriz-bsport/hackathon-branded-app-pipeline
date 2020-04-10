// @flow

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import React from 'react';
import { Form } from 'formik';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import { compose } from 'recompose';
import { Submit } from '../../../components/forms';

import PrivateServiceFields, {
  PrivateServiceFormikHOC,
} from './PrivateServiceForm.component';

type Props = {
  fullScreen: boolean,
  open: boolean,
  availableCoaches: Array<AssociatedCoach>,
  availableEstablishments: Array<AssociatedEstablishment>,
  isSubmitting: boolean,
  initial: ?PrivateServiceData,
  t: TFunction,
};

export const PrivateServiceFormDialog = (props: Props) => {
  return (
    <Dialog fullScreen={props.fullScreen} open={!!props.open}>
      <Form>
        <DialogTitle>{props.t('service.form.title')}</DialogTitle>
        <DialogContent>
          <PrivateServiceFields {...props} />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onCancel}>
            {props.t('service.form.actions.cancel')}
          </Button>
          <Submit disabled={props.isSubmitting}>
            {props.t('service.form.actions.submit')}
          </Submit>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

export default compose(
  withMobileDialog(),
  withNamespaces(['privateService']),
  PrivateServiceFormikHOC,
)(PrivateServiceFormDialog);
