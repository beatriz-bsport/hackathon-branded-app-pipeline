// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withNamespaces } from 'react-i18next';
import { push } from 'react-router-redux';
import { emailDesignCreate } from '../../libs/email-editor/actions';

import EmailEditorPanel from '../../libs/email-editor/components/EmailEditor.component';
import withTitle from '../../hocs/with-title.hoc';
import { snackbarError } from '../../actions/snackbar.actions';

type Props = {
  company_id: number,
  emailDesignCreate: (data: any) => void,
  goToList: () => void,
  snackbarError: (msg: string) => void,
};

export class EmailTemplateCreate extends Component<Props> {
  onSave = (id: number, data: *) => {
    this.props.emailDesignCreate(data);
    this.props.goToList();
  };

  render() {
    return (
      <EmailEditorPanel
        company_id={this.props.company_id}
        save_email={this.onSave}
        emailLoad=""
        goToList={this.props.goToList}
        displayEmptyError={this.props.snackbarError}
      />
    );
  }
}

export default compose(
  withNamespaces(['emailTemplate']),
  withTitle(({ t }) => t('createTitle')),
  connect(
    (state) => ({
      company_id: state.theme.theme.company,
    }),
    {
      snackbarError,
      emailDesignCreate,
      goToList: () => push('/email/list'),
    },
  ),
)(EmailTemplateCreate);
