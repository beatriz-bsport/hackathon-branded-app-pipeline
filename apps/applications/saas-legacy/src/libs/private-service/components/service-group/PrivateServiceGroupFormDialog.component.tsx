import React from 'react';
import { useTranslation } from 'react-i18next';
import { compose } from 'recompose';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

import { Form } from 'formik';

import type { PrivateServiceGroupWithService } from '#src/libs/private-service/types';
import PrivateServiceGroupForm, {
  PrivateServiceGroupFormikHOC,
  // @ts-expect-error
} from './PrivateServiceGroupForm.component';
// @ts-expect-error
import { Submit } from '../../../../components/forms';

import type { OptionCallback } from '../../../../state/types';

type Props = {
  open: boolean;
  onSubmit: (
    data: Partial<PrivateServiceGroupWithService>,
    options: OptionCallback,
  ) => void;
  onCancel: () => void;
  initial: Partial<PrivateServiceGroupWithService> | null;
};

export const PrivateServiceGroupFormDialog: React.FC<Props> = ({
  open,
  onSubmit,
  onCancel,
  initial,
}) => {
  const { t } = useTranslation(['privateService']);
  return (
    <Dialog open={open}>
      <Form>
        <DialogTitle>{t('serviceGroup.form.title')}</DialogTitle>
        <DialogContent>
          <PrivateServiceGroupForm initial={initial} onSubmit={onSubmit} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>
            {t('serviceGroup.form.actions.cancel')}
          </Button>
          <Submit>{t('serviceGroup.form.actions.submit')}</Submit>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

export default compose<any, Props>(
  PrivateServiceGroupFormikHOC,
  React.memo,
)(PrivateServiceGroupFormDialog);
