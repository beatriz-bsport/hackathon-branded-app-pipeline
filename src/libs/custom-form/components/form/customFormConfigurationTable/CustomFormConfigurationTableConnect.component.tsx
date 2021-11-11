import React from 'react';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import { useTranslation } from 'react-i18next';

import { useFormikContext, FormikProps } from 'formik';

import Typography from '@material-ui/core/Typography';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import CheckOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';

import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { CustomForm, CustomFormField } from '../../../types';

type FormikValuesProps = CustomForm & {
  custom_form_field_enabled: Array<CustomFormField>;
  custom_form_field_disabled: Array<CustomFormField>;
};
const useStyles = makeStyles((theme) => ({
  changeWarning: {
    color: amber[900],
    marginRight: theme.spacing(1),
  },
  noChangeWarning: {
    color: green[600],
    marginRight: theme.spacing(1),
  },
  formChangeContainer: {
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    border: `1px solid ${amber[900]}`,
    borderRadius: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
  },
  formNoChangeContainer: {
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    border: `1px solid ${green[600]}`,
    borderRadius: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
  },
}));

type Props = {
  isSubmitting: boolean;
  setNumberOfQuestionsHasChanged: (open: boolean) => void;
  setregisteredSignUpQuestions: (kind_list: Array<number>) => void;
} & FormikProps<FormikValuesProps>;
export const FormikChangesLookUp = (props: Props) => {
  const {
    dirty,
    resetForm,
    initialValues,
    values,
  }: {
    dirty: boolean;
    resetForm: () => void;
    initialsValues: FormikValuesProps;
    values: FormikValuesProps;
  } = useFormikContext();
  const { t } = useTranslation('marketing');
  const classes = useStyles();

  React.useEffect(() => {
    if (props.isSubmitting) {
      resetForm({ dirty: false });
      props.setNumberOfQuestionsHasChanged(false);
    }
    if (
      values?.custom_form_field_disabled?.length !==
        initialValues.custom_form_field_disabled?.length ||
      values?.custom_form_field_enabled?.length !==
        initialValues.custom_form_field_enabled?.length
    ) {
      props.setNumberOfQuestionsHasChanged(true);
      const signup_questions_registered_disabled =
        values.custom_form_field_disabled
          .filter((field) => field.signup_question_kind)
          .map((field) => field.signup_question_kind);
      const signup_questions_registered_enabled =
        values.custom_form_field_enabled
          .filter((field) => field.signup_question_kind)
          .map((field) => field.signup_question_kind);
      props.setregisteredSignUpQuestions([
        ...signup_questions_registered_disabled,
        ...signup_questions_registered_enabled,
      ]);
    }
    //  eslint-disable-next-line
  }, [props.isSubmitting, initialValues, values]);

  return (
    <>
      {dirty ? (
        <div className={classes.formChangeContainer}>
          <InfoOutlinedIcon className={classes.changeWarning} />
          <Typography variant="caption" className={classes.changeWarning}>
            {t('customForm.changesDetected')}
          </Typography>
        </div>
      ) : (
        <div className={classes.formNoChangeContainer}>
          {!props.isSubmitting ? (
            <>
              <CheckOutlinedIcon className={classes.noChangeWarning} />
              <Typography variant="caption" className={classes.noChangeWarning}>
                {t('customForm.noChanges')}
              </Typography>
            </>
          ) : (
            <>
              <CircularProgress size={20} className={classes.noChangeWarning} />
              <Typography variant="caption" className={classes.noChangeWarning}>
                {t('customForm.changesAreSubmitting')}
              </Typography>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default FormikChangesLookUp;
