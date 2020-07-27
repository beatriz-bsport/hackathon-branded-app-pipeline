// @flow
//

import React from 'react';
import { compose, withHandlers, withStateHandlers, withProps } from 'recompose';
import ReCAPTCHA from 'react-google-recaptcha';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import PasswordInput from '../../../components/input/PasswordInput.component';
import LocaleSelector from '../../../components/input/LocaleSelector.component';
import DelayedTextField from '../../../components/DelayedTextField.component';

import Config from '../../../config';

type Props = {
  hasBeenSubmitted: boolean,
  onNext: () => void,
  onPrevious: () => void,
  onSubmit: (string, OptionCallback) => void,

  name: string,
  setName: (SyntheticEvent<HTMLElement>) => void,

  email: string,
  setEmail: (SyntheticEvent<HTMLElement>) => void,
  emailExists: boolean,
  checkEmailExistsLoading: boolean,

  password1: string,
  password2: string,
  setPassword1: (SyntheticEvent<HTMLElement>) => void,
  setPassword2: (SyntheticEvent<HTMLElement>) => void,
  passwordMismatch: boolean,

  locale: string,
  setLocale: (SyntheticEvent<HTMLElement>) => void,

  validateCaptcha: (boolean) => void,
  validatedCaptcha: boolean,
};

export const CompanySignupForm = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['login']);
  const recaptchaRef = React.useRef(null);
  return (
    <form
      className={classes.container}
      onSubmit={(ev) => {
        ev.preventDefault();
        if (props.hasBeenSubmitted) {
          props.onNext();
        } else {
          props.onSubmit(recaptchaRef.current.getValue(), {
            onError: () => {
              recaptchaRef.reset();
            },
          });
        }
      }}
    >
      <div className={classes.title}>
        <Typography variant="h4">{t('signupCompany.form.title')}</Typography>
      </div>
      <div className={classes.field}>
        <TextField
          fullWidth
          value={props.name}
          onChange={props.setName}
          label={t('signupCompany.form.name.label')}
          helperText={t('signupCompany.form.name.helperText')}
          placeholder={t('signupCompany.form.name.placeholder')}
          required
        />
      </div>
      <div className={classes.field}>
        <DelayedTextField
          fullWidth
          required
          autoComplete="email"
          type="email"
          value={props.email}
          onChange={props.setEmail}
          label={t('signupCompany.form.email.label')}
          placeholder={t('signupCompany.form.email.placeholder')}
          helperText={
            !!props.emailExists && t('signupCompany.form.email.errorExists')
          }
          error={props.emailExists}
        />
        {props.checkEmailExistsLoading && <CircularProgress size={12} />}
      </div>
      <PasswordInput
        className={classes.field}
        type="password"
        value={props.password1}
        required
        onChange={props.setPassword1}
        label={t('signupCompany.form.password1.label')}
      />
      <PasswordInput
        className={classes.field}
        type="password"
        value={props.password2}
        required
        onChange={props.setPassword2}
        error={props.passwordMismatch}
        helperText={
          props.passwordMismatch && t('signupCompany.form.password2.error')
        }
        label={t('signupCompany.form.password2.label')}
      />
      <div className={classes.field}>
        <LocaleSelector
          value={props.locale}
          withCurrency
          onChange={props.setLocale}
        />
      </div>
      <div className={classes.field}>
        <ReCAPTCHA
          ref={recaptchaRef}
          onChange={(v) => {
            props.validateCaptcha(!!v);
          }}
          onExpired={() => props.validateCaptcha(false)}
          onErrored={() => props.validateCaptcha(false)}
          sitekey={`${Config.REACT_APP_RECAPTCHA_V2}`}
        />
      </div>
      <ButtonGroup className={classes.actions} color="primary">
        <Button onClick={props.onPrevious}>
          {t('signupCompany.form.previous')}
        </Button>
        <Button
          type="submit"
          disabled={props.passwordMismatch || !props.validatedCaptcha}
        >
          {t('signupCompany.form.next')}
        </Button>
      </ButtonGroup>
    </form>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    '&>*': {
      marginBottom: theme.spacing(2),
    },
  },
  title: {
    marginBottom: theme.spacing(4),
  },
  field: {
    marginBottom: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  captcha: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  actions: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',
  },
}));

export default compose(
  withStateHandlers(
    {
      name: '',
      email: '',
      password1: '',
      password2: '',
      passwordMismatch: false,
      validatedCaptcha: false,
      locale: 'fr_FR',
    },
    {
      setEmail: (_, { checkEmailExists }) => (ev) => {
        checkEmailExists(ev.target.value);
        return { email: ev.target.value };
      },
      setName: () => (ev) => ({ name: ev.target.value }),
      setPassword1: () => (ev) => ({
        password1: ev.target.value,
      }),
      setPassword2: () => (ev) => ({
        password2: ev.target.value,
      }),
      validateCaptcha: () => (validatedCaptcha) => ({ validatedCaptcha }),
      setLocale: () => (ev) => ({ locale: ev.target.value }),
    },
  ),
  withProps(({ password1, password2 }) => ({
    passwordMismatch: password1 !== password2 && (!!password1 || !!password2),
  })),
  withHandlers({
    onSubmit: ({ onSubmit, email, password1, name, locale }) => (recaptcha) => {
      onSubmit({ recaptcha, email, password: password1, name, locale });
    },
  }),
)(CompanySignupForm);
