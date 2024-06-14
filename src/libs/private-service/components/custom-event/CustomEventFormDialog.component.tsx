import React from 'react';

import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import { Form } from 'formik';
import { makeStyles } from '@material-ui/core/styles';

import { useTranslation } from 'react-i18next';
import CustomEventForm, {
  CustomEventFormikHOC,
  //@ts-expect-error
} from './CustomEventForm.component';
//@ts-expect-error
import { Submit } from '#src/components/forms';
import type { ResourceData } from '#src/libs/private-service/types';
import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';
import type { Coach } from '#src/libs/associated-coach/types';
type Props = {
  coaches: Coach[];
  open: boolean;
  onClose: () => void;
  resourceAvailable: Array<ResourceData>;
  selectedResourceIdentifier: string;
  setSelectedResourceIdentifier: (ressourceIdentifier: string) => void;
  onSubmit: (data: { [resourceDatatype: string]: string }) => void;
  isSubmitting: boolean;
};

export const CustomEvenFormDialog: React.FC<Props> = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation('privateService');

  return (
    <GenericResponsiveDialog open={props.open}>
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
    </GenericResponsiveDialog>
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

export default React.memo(CustomEventFormikHOC)(CustomEvenFormDialog);
