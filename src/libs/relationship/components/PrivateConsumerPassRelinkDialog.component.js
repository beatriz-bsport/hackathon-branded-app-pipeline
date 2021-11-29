// @flow
import React from 'react';
import { compose, pure } from 'recompose';
import { withTranslation, TFunction } from 'react-i18next';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import RedButton from '../../../components/button/RedButton.component';

type Props = {
  t: TFunction,
  onCancel: () => void,
  onSubmit: (privateConsumerPassLinkId: number) => void,
  open: boolean,
  privateConsumerPassLinkId: number,
};

export const PrivateConsumerPassRelinkDialog = (props: Props) => {
  const { t } = props;
  return (
    <Dialog open={props.open}>
      <DialogTitle>
        {t('private_consumer_pass_links.form.relink.title')}
      </DialogTitle>
      <DialogContent>
        {t('private_consumer_pass_links.form.relink.explain')}
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onCancel}>
          {t('private_consumer_pass_links.form.relink.cancel')}
        </Button>
        <RedButton
          onClick={() => props.onSubmit(props.privateConsumerPassLinkId)}
        >
          {t('private_consumer_pass_links.form.relink.submit')}
        </RedButton>
      </DialogActions>
    </Dialog>
  );
};

export default compose(
  withTranslation(['relationship']),
  pure,
)(PrivateConsumerPassRelinkDialog);
