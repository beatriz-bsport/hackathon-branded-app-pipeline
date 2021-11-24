import React from 'react';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';

import { createStyles, Theme } from '@material-ui/core/styles';
import { Form } from 'formik';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import ConsumerFormFields, {
  ConsumerFormFieldsHOC,
} from './CustomForm.formik-hoc';
import { MaterialStyleType } from '../../../../utils/types';
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

type OwnProps = {
  asManager?: boolean;
  handleCancel?: () => void;
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
  disableLayout: boolean;
};
type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

export function ConsumerFormView(props: Props) {
  const { t, isSubmitting, classes, asManager } = props;
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
          <InfoIcon className={classes.leftIcon} />
          <Typography variant="caption" align="center">
            {t('customForm.emptyCustomForm')}
          </Typography>
        </div>
      </div>
    );
  }
  return (
    <Form>
      <ConsumerFormFields {...props} />
      {!asManager && (
        <div
          className={props.onCancel ? classes.submitAndCancel : classes.submit}
        >
          {props.onCancel && (
            <Button
              onClick={() => props.onCancel(props.values)}
              variant="text"
              color="primary"
              disabled={isSubmitting}
            >
              {props.disconnectOnCancel
                ? t('customForm.disconnect')
                : t('customForm.previous')}
            </Button>
          )}
          <Button
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
}

const styles = (theme: Theme) =>
  createStyles({
    paperContainer: {
      padding: theme.spacing(6),
    },
    submit: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    submitAndCancel: {
      display: 'flex',
      justifyContent: 'space-between',
    },
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
  });
export default compose<any, OwnProps>(
  withTranslation('marketing'),
  withStyles(styles),
  ConsumerFormFieldsHOC,
)(ConsumerFormView);
