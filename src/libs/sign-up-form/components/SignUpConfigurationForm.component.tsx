import React from 'react';
import lodash from 'lodash';
import { Form } from 'formik';
import { WithTranslation, withTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { Theme } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'redux';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import SignUpConfigurationFields, {
  SignUpConfigurationFormHoc,
} from './SignUpConfigurationFormHOC.component';
import { Submit } from '../../../components/forms';
import { MaterialStyleType } from '../../../utils/types';
import type { SignUpFormConfig } from '../types';
import withConfirm from '../../../hocs/with-confirm.hoc';

type OwnProps = {
  onSubmit: (id: number, data: SignUpFormConfig, options?: any) => void;
  isSubmitting: boolean;
  initial?: SignUpFormConfig;
  values: SignUpFormConfig;
  goToCustomFormList?: () => void;
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;
const ButtonWithConfirm = withConfirm(Button, 'onClick', {
  title: 'theme:signUpForm.customQuestionDialog.title',
  cancel: 'theme:signUpForm.customQuestionDialog.cancel',
  confirm: 'theme:signUpForm.customQuestionDialog.confirm',
  Content: ({ t }: { t: TFunction }) => (
    <p>{t('theme:signUpForm.customQuestionDialog.content')}</p>
  ),
});
export function SignUpConfigurationForm(props: Props) {
  const { t, isSubmitting, classes } = props;
  const checkChange = () => lodash.isEqual(props.initial, props.values);

  return (
    <Form>
      <div>
        <SignUpConfigurationFields {...props} />
      </div>
      <div className={classes.buttonContainer}>
        <ButtonWithConfirm
          onClick={() =>
            props.onSubmit(props.values.id, props.values, {
              onSuccess: () => props.goToCustomFormList(),
            })
          }
        >
          <Button color="primary">
            <AddIcon color="primary" />
            {t('signUpForm.addQuestions')}
          </Button>
        </ButtonWithConfirm>
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
    justifyContent: 'space-between',
    padding: theme.spacing(2),
  },
});
export default compose<any, OwnProps>(
  // @ts-ignore
  withTranslation(['theme']),
  withStyles(styles),
  SignUpConfigurationFormHoc,
)(SignUpConfigurationForm);
