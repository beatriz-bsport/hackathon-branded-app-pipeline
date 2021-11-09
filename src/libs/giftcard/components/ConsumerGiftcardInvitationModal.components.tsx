import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import LinkIcon from '@material-ui/icons/Link';
import Typography from '@material-ui/core/Typography';
import { OptionCallback } from '../../../state/types';

import { makeActivationLink } from '../utils';
import { ConsumerGiftcard } from '../types';
import EmailInputWithChips from '../../../components/input/email-input-with-chip';

type Props = {
  onSubmit: (
    data: { recipients: Array<string> },
    options: OptionCallback,
  ) => void;
  onClose: () => void;
  consumerGiftcard: ConsumerGiftcard;
  snackbarSuccess: (msg: string) => void;
  companyId: number;
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
        <CopyToClipboard
          text={makeActivationLink(
            props.companyId,
            props.consumerGiftcard.activation_code,
          )}
        >
          <Button
            className={classes.link}
            onClick={() =>
              props.snackbarSuccess && props.snackbarSuccess('link.copied')
            }
          >
            <LinkIcon />
            <Typography className={classes.linkTypo}>
              {t('link.activationLink')}
            </Typography>
          </Button>
        </CopyToClipboard>
        <EmailInputWithChips
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
  link: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    '&:hover': {
      backgroundColor: '#EFEFEF',
      borderRadius: 5,
    },
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 5,
    borderColor: '#696969',
  },
  linkTypo: {
    paddingLeft: theme.spacing(1),
    marginRight: theme.spacing(1.5),
  },
}));

export default ConsumerGiftcardInvitationModal;
