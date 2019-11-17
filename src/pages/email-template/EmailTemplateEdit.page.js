// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withNamespaces } from 'react-i18next';
import { push } from 'react-router-redux';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import {
  getEmailTemplatesDetail,
  getAllEmailTemplatesDict,
} from '../../libs/email-editor/selectors';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import withTitle from '../../hocs/with-title.hoc';
import { snackbarError } from '../../actions/snackbar.actions';

import {
  emailTemplateComplete,
  emailTemplateUpdate,
  emailDesignCreate,
} from '../../libs/email-editor/actions';

import EmailEditorPanel from '../../libs/email-editor/components/EmailEditor.component';

type Props = {
  id: number,
  company_id: number,
  create: number,
  loading: boolean,
  company_name: string,
  emailTemplateComplete: (id: number) => void,
  emailDesignCreate: (data: any) => void,
  emailTemplateUpdate: (id: number, data: any) => void,
  goToList: () => void,
  goToDetailList: () => void,
  email_templates_details: any,
  email_templates_summaries: any,
  snackbarError: (msg: string) => void,
};

export class MarketingEmail extends Component<Props, state> {
  componentDidMount() {
    this.props.emailTemplateComplete(this.props.id);
  }

  onSave = (id, data) => {
    if (this.props.create === 1) {
      this.props.emailDesignCreate(data);
      this.props.goToList();
    } else {
      this.props.emailTemplateUpdate(id, data);
      this.props.goToDetailList(id);
    }
  };

  render() {
    if (this.props.loading || !this.props.email_templates_details) {
      return <LinearProgress />;
    }
    return (
      <EmailEditorPanel
        company_id={this.props.company_id}
        save_email={this.onSave}
        emailLoad={{
          ...this.props.email_templates_summaries[this.props.id],
          ...this.props.email_templates_details[this.props.id],
        }}
        company_name={this.props.company_name}
        goToList={this.props.goToList}
        displayEmptyError={this.props.snackbarError}
      />
    );
  }
}

export default compose(
  withNamespaces(['emailTemplate']),
  routerParamsToProps({ id: 'id:number', create: 'create:number' }),
  withTitle(({ t }) => t('editTitle')),
  connect(
    (state) => ({
      email_templates_details: getEmailTemplatesDetail(state),
      email_templates_summaries: getAllEmailTemplatesDict(state),
      loading: state.emailTemplate.detail.isLoading,
      company_id: state.theme.theme.company,
      company_name: state.theme.theme.company_name,
    }),
    {
      snackbarError,
      emailTemplateComplete,
      emailDesignCreate,
      emailTemplateUpdate,
      goToDetailList: (id) => push(`/email/list/${id}`),
      goToList: () => push('/email/list/'),
    },
  ),
)(MarketingEmail);
