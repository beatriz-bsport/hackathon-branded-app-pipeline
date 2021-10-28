import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { OptionCallback } from '../../../state/types';

import { makeActivationLink } from '../utils';
import { ConsumerGiftcard } from '../types';
import EmailInputWithChipsGenerator from '../../../components/input/EmailInputWithChipsGenerator.component';

type Props = {
  onSubmit: (
    data: { recipients: Array<string> },
    options: OptionCallback,
  ) => void;
  onClose: () => void;
  consumerGiftcard: ConsumerGiftcard;
};

const ConsumerGiftcardInvitationModal = (props: Props) => {
  const { t } = useTranslation(['giftcard']);
  const classes = useStyles();
  const [recipient, setRecipient] = React.useState(
    props.consumerGiftcard.giftcard_recipients.map((r) => r.email_sent_to),
  );
  const [processing, setProcessing] = React.useState(false);
  const hasBeenSent =
    !!props.consumerGiftcard.date_activated ||
    !!props.consumerGiftcard?.invitation_sent;

  const addEmailToList = (email: string) => {
    setRecipient([...recipient, email]);
  };

  const removeEmailFromList = (index: number) => {
    setRecipient([...recipient].filter((_, i) => i !== index));
  };

  return (
    <Dialog open>
      <DialogTitle>{t('consumerGiftcard.invitationForm.title')}</DialogTitle>
      <DialogContent>
        <Typography className={classes.description}>
          {t(
            hasBeenSent
              ? 'consumerGiftcard.invitationForm.activationCodeLink'
              : 'consumerGiftcard.invitationForm.content',
          )}
        </Typography>
        <Typography className={classes.activationLink}>
          {makeActivationLink(
            props.companyId,
            props.consumerGiftcard.activation_code,
          )}
        </Typography>
        <EmailInputWithChipsGenerator
          disabled={hasBeenSent || processing}
          emailList={recipient}
          textFieldLabel={t('consumerGiftcard.form.recipients.label')}
          required
          textFieldName="recipients"
          addEmailToList={addEmailToList}
          removeEmailFromList={removeEmailFromList}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={processing} onClick={props.onClose}>
          {t('consumerGiftcard.invitationForm.actions.close')}
        </Button>
        <Button
          disabled={!!(processing || hasBeenSent || recipient?.length)}
          color="primary"
          onClick={() => {
            setProcessing(true);
            props.onSubmit(
              { email_sent_to: recipient },
              {
                onSuccess: () => setProcessing(false),
                onError: () => setProcessing(false),
              },
            );
          }}
        >
          {t('consumerGiftcard.invitationForm.actions.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  description: {
    marginBottom: theme.spacing(2),
  },
  activationLink: {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
}));

export default ConsumerGiftcardInvitationModal;
