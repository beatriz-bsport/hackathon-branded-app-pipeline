import React from 'react';
import { useTranslation } from 'react-i18next';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';

import { Form } from 'formik';
import GiftcardForm, { GiftcardFormFieldHOC } from './GiftcardForm.component';
import { OptionCallback } from '../../../state/types';
import { GiftcardData } from '../types';
import { Submit } from '../../../components/forms';

type Props = {
  open: boolean;
  onSubmit: (data: GiftcardData, options: OptionCallback) => void;
  onClose: () => void;
};

const GiftcardFormDialog = (props: Props) => {
  const { t } = useTranslation(['giftcard']);

  if (!props.open) {
    return null;
  }
  return (
    <Dialog open>
      <Form>
        <DialogTitle>{t('form.giftcard.title')}</DialogTitle>
        <DialogContent>
          <GiftcardForm {...props} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.onClose()}>
            {t('form.giftcard.actions.cancel')}
          </Button>
          <Submit>{t('form.giftcard.actions.submit')}</Submit>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

export default GiftcardFormFieldHOC(GiftcardFormDialog);
