import React from 'react';
import { useTranslation } from 'react-i18next';

import makeStyles from '@material-ui/core/styles/makeStyles';
import { Theme } from '@material-ui/core/styles/createTheme';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';

type Props = {
  submit: (email: string) => void;
  onCancel: () => void;
};

export const CoachEmailCheckDialog: React.FC<Props> = ({
  submit,
  onCancel,
}) => {
  const { t } = useTranslation('coach');

  const classes = useStyles();

  const [email, setEmail] = React.useState('');

  return (
    <div>
      <DialogTitle>{t('forms.linkByEmail.title')}</DialogTitle>
      <DialogContent>
        <Typography>{t('forms.linkByEmail.explain')}</Typography>
        <TextField
          type="email"
          className={classes.marginTop}
          placeholder={t('forms.linkByEmail.emailPlaceHolder')}
          label={t('forms.linkByEmail.emailLabel')}
          onChange={(ev) => setEmail(ev.target.value)}
          value={email}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{t('forms.linkByEmail.cancel')}</Button>
        <Button
          onClick={() => submit(email)}
          color="primary"
          variant="contained"
        >
          {t('forms.linkByEmail.submit')}
        </Button>
      </DialogActions>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  marginTop: {
    marginTop: theme.spacing(2),
  },
}));

export default CoachEmailCheckDialog;
