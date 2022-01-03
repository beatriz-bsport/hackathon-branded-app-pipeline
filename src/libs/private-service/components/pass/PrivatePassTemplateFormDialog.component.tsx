import React from 'react';

import { useTranslation } from 'react-i18next';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { Form } from 'formik';

import PrivatePassTemplateForm, {
  PrivatePassTemplateFormikHOC,
} from './PrivatePassTemplateForm.component';

type Props = {
  open?: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
};

const PrivatePassTemplateFormDialog = (props: Props) => {
  const { t } = useTranslation(['privateService']);

  return (
    <Dialog open={props.open}>
      <Form>
        <DialogTitle>{t('privatePassTemplate.form.title')}</DialogTitle>
        <DialogContent>
          <PrivatePassTemplateForm {...props} />
        </DialogContent>
      </Form>
    </Dialog>
  );
};

export default PrivatePassTemplateFormikHOC(PrivatePassTemplateFormDialog);
