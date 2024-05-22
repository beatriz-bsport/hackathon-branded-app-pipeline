import React from 'react';
import { compose, withHandlers, withStateHandlers, withProps } from 'recompose';
import ReCAPTCHA from 'react-google-recaptcha';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import PasswordInput from '../../../components/input/PasswordInput.component';
import LocaleSelector from '../../../components/input/LocaleSelector.component';
import TimezoneSelector from '../../../components/input/TimezoneSelector.component';
import DelayedTextField from '../../../components/DelayedTextField.component';
import { OptionCallback } from '../../../state/types';
import { getTimezonesForCountry } from '#src/i18n/utils/timezone-country';

import Config from '../../../config';

type Props = {
  hasBeenSubmitted: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: (captach: string, options: OptionCallback) => void;

  name: string;
  setName: (ev: React.ChangeEvent<HTMLElement>) => void;

  email: string;
  setEmail: (ev: React.ChangeEvent<HTMLElement>) => void;
  emailExists: boolean;
  checkEmailExistsLoading: boolean;

  password1: string;
  password2: string;
  setPassword1: (ev: React.ChangeEvent<HTMLElement>) => void;
  setPassword2: (ev: React.ChangeEvent<HTMLElement>) => void;
  passwordMismatch: boolean;

  locale: string;
  setLocale: (ev: React.ChangeEvent<HTMLElement>) => void;

  validateCaptcha: (v: boolean) => void;
  validatedCaptcha: boolean;

  timezone_name: string;
  setTimezone: (timezone: string) => void;
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
              // @ts-expect-error
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
          required
          helperText={t('signupCompany.form.name.helperText')}
          label={t('signupCompany.form.name.label')}
          onChange={props.setName}
          placeholder={t('signupCompany.form.name.placeholder')}
          value={props.name}
        />
      </div>
      <div className={classes.field}>
        <DelayedTextField
          fullWidth
          required
          autoComplete="email"
          error={props.emailExists}
          helperText={
            !!props.emailExists && t('signupCompany.form.email.errorExists')
          }
          label={t('signupCompany.form.email.label')}
          onChange={props.setEmail}
          placeholder={t('signupCompany.form.email.placeholder')}
          type="email"
          value={props.email}
        />
        {props.checkEmailExistsLoading && <CircularProgress size={12} />}
      </div>
      <PasswordInput
        // @ts-expect-error
        required
        className={classes.field}
        label={t('signupCompany.form.password1.label')}
        onChange={props.setPassword1}
        type="password"
        value={props.password1}
      />
      <PasswordInput
        // @ts-expect-error
        required
        className={classes.field}
        error={props.passwordMismatch}
        helperText={
          props.passwordMismatch && t('signupCompany.form.password2.error')
        }
        label={t('signupCompany.form.password2.label')}
        onChange={props.setPassword2}
        type="password"
        value={props.password2}
      />
      <div className={classes.field}>
        <LocaleSelector
          label={t('signupCompany.form.country.label')}
          onChange={props.setLocale}
          value={props.locale}
        />
        <TimezoneSelector
          fullWidth
          country={props.locale.slice(3, 6)}
          label={t('signupCompany.form.timezone.label')}
          // @ts-expect-error
          onChange={props.setTimezone}
          value={props.timezone_name}
        />
      </div>
      <div className={classes.field}>
        <ReCAPTCHA
          ref={recaptchaRef}
          // @ts-expect-error
          onChange={(v: boolean) => {
            props.validateCaptcha(!!v);
          }}
          onErrored={() => props.validateCaptcha(false)}
          onExpired={() => props.validateCaptcha(false)}
          sitekey={`${Config.REACT_APP_RECAPTCHA_V2}`}
        />
      </div>
      <ButtonGroup className={classes.actions} color="primary">
        <Button onClick={props.onPrevious}>
          {t('signupCompany.form.previous')}
        </Button>
        <Button
          disabled={
            props.passwordMismatch ||
            !props.validatedCaptcha ||
            !props.timezone_name
          }
          type="submit"
        >
          {t('signupCompany.form.next')}
        </Button>
      </ButtonGroup>
    </form>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
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
    '&>*': {
      marginRight: theme.spacing(2),
    },
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
      timezone_name: 'Europe/Paris',
    },
    {
      setEmail:
        (
          _,
          { checkEmailExists }: { checkEmailExists: (email: string) => void },
        ) =>
        (ev) => {
          checkEmailExists(ev.target.value);
          return { email: ev.target.value };
        },
      setName: () => (ev) => ({
        name: ev.target.value.replace('/', '-').replace('?', ' '),
      }),
      setTimezone: () => (ev) => ({ timezone_name: ev.target.value }),
      setPassword1: () => (ev) => ({
        password1: ev.target.value,
      }),
      setPassword2: () => (ev) => ({
        password2: ev.target.value,
      }),
      validateCaptcha: () => (validatedCaptcha) => ({ validatedCaptcha }),
      setLocale: () => (ev) => {
        const timezoneList = getTimezonesForCountry(
          ev.target.value.slice(3, 6),
          false,
        );
        let timezone_name = null;
        if (timezoneList?.length === 1) {
          timezone_name = timezoneList[0].name;
        }
        return {
          locale: ev.target.value,
          timezone_name,
        };
      },
    },
  ),
  withProps(({ password1, password2 }) => ({
    passwordMismatch: password1 !== password2 && (!!password1 || !!password2),
  })),
  withHandlers({
    onSubmit:
      ({ onSubmit, email, password1, name, locale, timezone_name }) =>
      (recaptcha: string) => {
        onSubmit({
          recaptcha,
          email,
          password: password1,
          name,
          locale,
          timezone_name,
        });
      },
  }),
  // @ts-expect-error
)(CompanySignupForm);
