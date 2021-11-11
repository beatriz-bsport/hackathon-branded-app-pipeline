// @flow
import React from 'react';
import { compose } from 'recompose';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import { Form } from 'formik';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme, makeStyles } from '@material-ui/core/styles';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import CustomEventForm, {
  CustomEventFormikHOC,
} from './CustomEventForm.component';
import { Submit } from '../../../../components/forms';
// import ResourceItem from './ResourceItem.component';

type Props = {
  t: TFunction,
  open: boolean,
  setSelectedResourceIdentifier: string,
  onClose: () => void,
  resourceAvailable: Array<ResourceData>,
  selectedResourceIdentifier: string,
  setSelectedResourceIdentifier: (string) => void,
  onSubmit: (data: { [resourceDatatype: string]: string }) => void,
  isSubmitting: boolean,
};

export const CustomEvenFormDialog = (props: Props) => {
  const { t } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const classes = useStyles();

  return (
    <Dialog fullScreen={fullScreen} open={props.open} fullWidth>
      <Form>
        <DialogTitle>{t('customEvent.form.title')}</DialogTitle>
        <div className={classes.innerDialog}>
          <CustomEventForm {...props} />
        </div>
        <DialogActions className={classes.bottomButton}>
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

const useStyles = makeStyles((theme) => ({
  innerDialog: {
    padding: theme.spacing(2),
  },
  bottomButton: {
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

export default compose(
  withMobileDialog(),
  withTranslation(['privateService']),
  CustomEventFormikHOC,
)(CustomEvenFormDialog);
