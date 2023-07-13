import React, { useCallback } from 'react';
import { compose } from 'recompose';
import { useTranslation } from 'react-i18next';
import Alert from '@material-ui/lab/Alert/Alert';

import { makeStyles, Theme } from '@material-ui/core/styles';
import { Form } from 'formik';

import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import ConsumerFormFields, {
  ConsumerFormFieldsHOC,
} from './CustomForm.formik-hoc';
import {
  CustomForm,
  CustomFormFieldAnswer,
  CustomFormFilled,
  ResponsiveLayouts,
} from '../../types';
import {
  USER_STATUS_VALIDATION_WITH_USER_NOT_MEMBER_OF_COMPANY,
  USER_STATUS_VALIDATION_WITH_MEMBER_OF_COMPANY,
} from '../../../member/utils';

type Props = {
  asManager?: boolean;
  handleCancel?: () => void;
  handleSubmit?: () => void;
  isSubmitting?: boolean;
  initial?: CustomForm;
  onSubmit?: (data: FormData, options: any) => void;
  initialWithAnswer?: CustomFormFieldAnswer;
  refreshLoading?: boolean;
  onCancel?: (data?: FormData) => void;
  onSubmitDraft?: (customFormwithAnswer: CustomFormFilled) => void;
  isMulti?: boolean;
  disconnectOnCancel?: boolean;
  waiver?: string;
  layouts?: ResponsiveLayouts;
  general_terms_and_conditions?: string;
  userStatus?: number;
  textButtonConfirm?: boolean;
  disableLayout?: boolean;
  fieldsAreIndependent?: boolean;
  simplifyUI?: boolean;
  data?: FormData;
  values?: CustomFormFilled;
};

const ConsumerFormView: React.FC<Props> = (props: Props) => {
  const { isSubmitting, asManager, simplifyUI, onCancel, data } = props;

  const { t } = useTranslation('marketing');
  const classes = useStyles({ simplifyUI });

  const handleCancel = useCallback(() => {
    onCancel(data);
  }, [data, onCancel]);

  const renderConfirmButtonText = (userStatus?: number) => {
    if (userStatus === USER_STATUS_VALIDATION_WITH_USER_NOT_MEMBER_OF_COMPANY) {
      return 'member:forms.needInformationValidation.button.notMemberYet';
    }
    if (userStatus === USER_STATUS_VALIDATION_WITH_MEMBER_OF_COMPANY) {
      return 'member:forms.needInformationValidation.button.memberOfCompany';
    }
    if (props.textButtonConfirm) {
      return 'customForm.clientForms.modify';
    }
    return 'customForm.send';
  };
  if (props.refreshLoading) {
    return <LinearProgress />;
  }
  if (
    props.initial &&
    props.initial.custom_form_field &&
    props.initial.custom_form_field.length === 0
  ) {
    return (
      <div className={classes.emptyContainer}>
        <div className={classes.column}>
          <Alert severity="info" className={classes.alertInfo}>
            {t('customForm.emptyCustomForm')}
          </Alert>
        </div>
      </div>
    );
  }
  return (
    <Form className={classes.form}>
      <ConsumerFormFields {...props} />
      {!asManager && (
        <div
          className={props.onCancel ? classes.submitAndCancel : classes.submit}
        >
          {props.onCancel && (
            <Button
              className={classes.button}
              onClick={handleCancel}
              variant="text"
              color="primary"
              disabled={isSubmitting}
              id="button_custom_form_cancel"
            >
              {props.disconnectOnCancel
                ? t('customForm.disconnect')
                : t('customForm.previous')}
            </Button>
          )}
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={() => {
              props.handleSubmit();
              props.onSubmitDraft && props.onSubmitDraft(props.values);
            }}
            id="button_custom_form_save"
            disabled={isSubmitting}
          >
            {props.isMulti
              ? t('customForm.next')
              : t(renderConfirmButtonText(props.userStatus))}
          </Button>
        </div>
      )}
    </Form>
  );
};

const useStyles = makeStyles<Theme, { simplifyUI: boolean }>((theme) => ({
  alertInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  form: {
    padding: theme.spacing(1),
  },
  submit: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  submitAndCancel: ({ simplifyUI }) => ({
    display: 'flex',
    justifyContent: simplifyUI ? 'flex-end' : 'space-between',
    gap: simplifyUI ? theme.spacing(1) : 'none',
  }),
  emptyContainer: {
    padding: theme.spacing(10),
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  button: ({ simplifyUI }) => ({
    borderRadius: simplifyUI ? theme.spacing(3) : theme.spacing(1),
  }),
}));

export default compose<any, Props>(
  ConsumerFormFieldsHOC,
  React.memo,
)(ConsumerFormView);
