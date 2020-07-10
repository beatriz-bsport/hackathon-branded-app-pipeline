// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState } from 'recompose';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { Form } from 'formik';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import CustomEventForm, {
  CustomEventFormikHOC,
} from './CustomEventForm.component';
import { Submit } from '../../../../components/forms';
// import ResourceItem from './ResourceItem.component';

type Props = {
  t: TFunction,
  classes: Object,
  open: boolean,
  setSelectedResourceIdentifier: string,
  onClose: () => void,
  resourceAvailable: Array<ResourceData>,
  selectedResourceIdentifier: string,
  setSelectedResourceIdentifier: (string) => void,
  onSubmit: ({ [resourceDatatype: string]: string }) => void,
};

export const CustomEvenFormDialog = (props: Props) => {
  const { t, classes } = props;
  return (
    <Dialog open={props.open}>
      <Form>
        <DialogTitle>{t('customEvent.form.title')}</DialogTitle>
        <DialogContent>
          <CustomEventForm {...props} />
        </DialogContent>
        <DialogActions>
          <Button disabled={props.isSubmitting} onClick={props.onClose}>
            {t('customEvent.form.actions.cancel')}
          </Button>
          <Submit disabled={props.isSubmitting}>
            {t('customEvent.form.actions.submit')}
          </Submit>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

const styles = () => ({});

export default compose(
  withMobileDialog(),
  withTranslation(['privateService']),
  CustomEventFormikHOC,
)(CustomEvenFormDialog);
