// @flow
import React from 'react';
import { compose } from 'recompose';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { Form } from 'formik';

import PrivateServiceGroupForm, {
  PrivateServiceGroupFormikHOC,
} from './PrivateServiceGroupForm.component';
import { Submit } from '../../../../components/forms';

type Props = {
  t: TFunction,
  open: boolean,
  onSubmit: (any) => void,
  onCancel: () => void,
};

export const PrivateServiceGroupFormDialog = (props: Props) => {
  return (
    <Dialog open={!!props.open}>
      <Form>
        <DialogTitle>{props.t('serviceGroup.form.title')}</DialogTitle>
        <DialogContent>
          <PrivateServiceGroupForm {...props} />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onCancel}>
            {props.t('serviceGroup.form.actions.cancel')}
          </Button>
          <Submit>
            {props.t('serviceGroup.form.actions.submit')}
          </Submit>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

export default compose(
  withTranslation(['privateService']),
  PrivateServiceGroupFormikHOC,
)(PrivateServiceGroupFormDialog);
