import React from 'react';
import lodash from 'lodash';
import { Form } from 'formik';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'redux';
import SignUpConfigurationFields, {
  SignUpConfigurationFormHoc,
} from './SignUpConfigurationFormHOC.component';
import { Submit } from '../../../components/forms';
import { MaterialStyleType } from '../../../utils/types';
import type { SignUpFormConfig } from '../types';

type OwnProps = {
  onSubmit: (id: number, data: SignUpFormConfig, options?: any) => void;
  isSubmitting: boolean;
  initial?: SignUpFormConfig;
  values: SignUpFormConfig;
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

export function SignUpConfigurationForm(props: Props) {
  const { t, isSubmitting, classes } = props;
  const checkChange = () => lodash.isEqual(props.initial, props.values);

  return (
    <Form>
      <div>
        <SignUpConfigurationFields {...props} />
      </div>
      <div className={classes.buttonContainer}>
        <Submit
          id="sign-up-form-configuration"
          disabled={isSubmitting || checkChange()}
        >
          {t('signUpForm.save')}
        </Submit>
      </div>
    </Form>
  );
}
const styles = (theme: Theme) => ({
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: theme.spacing(2),
  },
});
export default compose<any, OwnProps>(
  // @ts-ignore
  withTranslation(['theme']),
  withStyles(styles),
  SignUpConfigurationFormHoc,
)(SignUpConfigurationForm);
