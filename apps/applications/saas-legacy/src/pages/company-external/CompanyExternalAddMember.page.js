// @flow
import React from 'react';
import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';

import { goBack as goBackAction } from 'connected-react-router';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/styles';
import { snackbar } from '../../actions/snackbar.actions';
import { createOrUpdateMember } from '../../libs/member/actions';
import { MemberMap } from '../../libs/member/utils';
import CustomFormView from '../../libs/custom-form/components/consumer-form/CustomFormView.form';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import { mapFormData } from '../form.utils';
import {
  fetchCompanyCustomSignUp as fetchCompanyCustomSignUpAction,
  submitSignUpCustomForm as submitSignUpCustomFormAction,
} from '../../libs/custom-form/actions';
import { getSignUpCustomFormWithEnabledField } from '../../libs/custom-form/selectors';

import type { CustomForm } from '../../libs/custom-form/types';
import type { Theme } from '../../libs/theme/types';
import type { OptionCallback } from '../../state/types';

type Props = {
  theme: Theme,
  goBack: () => void,
  fetchCompanyCustomSignUp: (params: { company?: number }) => void,
  signUpCustomForm: CustomForm,
  submitSignUpCustomForm: (
    formData: FormData,
    company_id: number | null,
    options?: OptionCallback,
  ) => void,
  companyId: number,
};

const useStyles = makeStyles((theme) => ({
  customFormPaper: {
    padding: theme.spacing(4),
    width: '100%',
  },
  paper: {
    padding: theme.spacing(4),
  },
}));

export const CompanyExternalAddMember = (props: Props) => {
  const {
    theme,
    goBack,
    fetchCompanyCustomSignUp,
    signUpCustomForm,
    submitSignUpCustomForm,
    companyId,
  } = props;

  const classes = useStyles();
  React.useEffect(() => {
    fetchCompanyCustomSignUp({ company: companyId });
  }, [fetchCompanyCustomSignUp, companyId]);

  const submitCustomForm = (formdata: FormData, options?: OptionCallback) => {
    submitSignUpCustomForm(formdata, companyId, {
      onSuccess: () => {
        goBack();
        if (options && options.onSuccess) options.onSuccess();
      },
      onError: () => {
        if (options && options.onError) options.onError();
      },
    });
  };

  return (
    <div className={classes.customFormPaper}>
      {signUpCustomForm && (
        <Paper className={classes.paper}>
          <CustomFormView
            shouldWrapLayerInCssHoc
            general_terms_and_conditions={theme.general_terms_of_use}
            initial={signUpCustomForm}
            layouts={signUpCustomForm.layout}
            onCancel={() => goBack()}
            onSubmit={submitCustomForm}
            waiver={theme.waiver}
          />
        </Paper>
      )}
    </div>
  );
};

export default compose(
  routerParamsToProps({ companyId: 'companyId:number' }),
  connect(
    (state) => ({
      theme: state.theme.theme,
      errors: state.member.upsert.error,
      country: state.theme.theme.locale.split('_')[1],
      signUpCustomForm: getSignUpCustomFormWithEnabledField(state),
    }),
    {
      goBack: goBackAction,
      snackbarSuccess: (msg) => snackbar.success(msg),
      upsertMember: createOrUpdateMember,
      fetchCompanyCustomSignUp: fetchCompanyCustomSignUpAction,
      submitSignUpCustomForm: submitSignUpCustomFormAction,
    },
  ),
  withProps(({ upsertMember, goBack }) => ({
    onSubmit: (values, options) => {
      if (!values.birthday) {
        delete values.birthday;
      }
      const formData = mapFormData(values, MemberMap);

      upsertMember(values.id, formData, {
        ...options,
        onSuccess: () => {
          options.onSuccess();
          goBack();
        },
      });
    },
  })),
)(CompanyExternalAddMember);
