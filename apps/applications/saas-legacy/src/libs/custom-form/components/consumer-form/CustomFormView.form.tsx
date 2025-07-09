import React, { useCallback } from 'react';
import { compose } from 'recompose';
import { useTranslation } from 'react-i18next';
import { Form } from 'formik';

import Alert from '@material-ui/lab/Alert/Alert';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import makeStyles from '@material-ui/core/styles/makeStyles';
import type { Theme } from '@material-ui/core/styles';

import clsx from 'clsx';
import {
  USER_STATUS_VALIDATION_WITH_USER_NOT_MEMBER_OF_COMPANY,
  USER_STATUS_VALIDATION_WITH_MEMBER_OF_COMPANY,
} from '#src/libs/member/utils';

import type {
  CustomForm,
  CustomFormFieldAnswer,
  CustomFormFilled,
  ResponsiveLayouts,
} from '#src/libs/custom-form/types';
import ConsumerFormFields, {
  ConsumerFormFieldsHOC,
} from './CustomForm.formik-hoc';
import type { OptionCallback } from '../../../../state/types';
import CustomFormButtonsCSS from '../CustomFormButtonsCSS';
import { useCssVariantActivated } from '../../hooks/useCssVariantActivated';

type Props = {
  asManager?: boolean;
  data?: CustomFormFieldAnswer;
  disableLayout?: boolean;
  disconnectOnCancel?: boolean;
  fieldsAreIndependent?: boolean;
  general_terms_and_conditions?: string;
  hideBackButton?: boolean;
  initial?: CustomForm;
  initialWithAnswer?: CustomFormFieldAnswer;
  isMulti?: boolean;
  isSubmitting?: boolean;
  layouts?: ResponsiveLayouts;
  refreshLoading?: boolean;
  simplifyUI?: boolean;
  textButtonConfirm?: boolean;
  userStatus?: number;
  values?: CustomFormFilled;
  measureBeforeMount?: boolean;
  shouldWrapLayerInCssHoc?: boolean;
  waiver?: string;
  handleSubmit?: () => void;
  onCancel?: (data?: CustomFormFieldAnswer) => void;
  onSubmit?: (data: CustomFormFieldAnswer, options: OptionCallback) => void;
  onSubmitDraft?: (customFormwithAnswer: CustomFormFilled) => void;
  rowHeight?: number;
};

const ConsumerFormView: React.FC<Props> = (props: Props) => {
  const {
    asManager,
    data,
    disconnectOnCancel,
    hideBackButton,
    initial,
    isMulti,
    isSubmitting,
    refreshLoading,
    simplifyUI,
    textButtonConfirm,
    userStatus,
    values,
    handleSubmit,
    onCancel,
    onSubmitDraft,
  } = props;

  const { t } = useTranslation('marketing');
  const classes = useStyles({ simplifyUI });

  const isCssVariantActivated = useCssVariantActivated();

  const handleCancel = useCallback(() => {
    onCancel(data);
  }, [data, onCancel]);

  const handleClickOnSubmit = useCallback(() => {
    handleSubmit();
    onSubmitDraft?.(values);
  }, [handleSubmit, onSubmitDraft, values]);

  const renderConfirmButtonText = (userStatusValidation?: number) => {
    if (
      userStatusValidation ===
      USER_STATUS_VALIDATION_WITH_USER_NOT_MEMBER_OF_COMPANY
    ) {
      return 'member:forms.needInformationValidation.button.notMemberYet';
    }
    if (
      userStatusValidation === USER_STATUS_VALIDATION_WITH_MEMBER_OF_COMPANY
    ) {
      return 'member:forms.needInformationValidation.button.memberOfCompany';
    }
    if (textButtonConfirm) {
      return 'customForm.clientForms.modify';
    }
    return 'customForm.send';
  };

  if (refreshLoading) {
    return <LinearProgress />;
  }

  if (initial?.custom_form_field?.length === 0) {
    return (
      <div className={classes.emptyContainer}>
        <div className={classes.column}>
          <Alert className={classes.alertInfo} severity="info">
            {t('customForm.emptyCustomForm')}
          </Alert>
        </div>
      </div>
    );
  }

  const customCssProps = {
    className: props.shouldWrapLayerInCssHoc ? 'bs-setup-variable' : '',
    id: props.shouldWrapLayerInCssHoc ? 'bs-setup-derived-variable' : undefined,
  };

  return (
    <Form className={classes.form}>
      <ConsumerFormFields {...props} />
      {isCssVariantActivated ? (
        <CustomFormButtonsCSS
          {...customCssProps}
          disconnectOnCancel={disconnectOnCancel}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit}
          isMulti={isMulti}
          isSubmitting={isSubmitting}
          onCancel={onCancel}
          onSubmitDraft={onSubmitDraft}
          renderConfirmButtonText={renderConfirmButtonText}
          simplifyUI={simplifyUI}
          userStatus={userStatus}
          values={values}
        />
      ) : (
        <div
          className={clsx({
            [classes.hidden]: asManager,
            [classes.submitAndCancel]: !!onCancel,
            [classes.submit]: !onCancel,
          })}
        >
          {onCancel && !hideBackButton && (
            <Button
              className={classes.button}
              color="primary"
              disabled={isSubmitting}
              id="button_custom_form_cancel"
              onClick={handleCancel}
              variant="text"
            >
              {disconnectOnCancel
                ? t('customForm.disconnect')
                : t('customForm.previous')}
            </Button>
          )}
          <Button
            className={classes.button}
            color="primary"
            disabled={isSubmitting}
            id="button_custom_form_save"
            onClick={handleClickOnSubmit}
            variant="contained"
          >
            {isMulti
              ? t('customForm.next')
              : t(renderConfirmButtonText(userStatus))}
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
  hidden: {
    display: 'none',
  },
}));

export default compose<any, Props>(
  ConsumerFormFieldsHOC,
  React.memo,
)(ConsumerFormView);
