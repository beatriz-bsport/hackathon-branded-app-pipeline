// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withNamespaces } from 'react-i18next';
import { push } from 'react-router-redux';
import { emailDesignCreate } from '../../libs/email-editor/actions';
import { Context } from '../../context';

import EmailEditorPanel from '../../libs/email-editor/components/EmailEditor.component';
import withTitle from '../../hocs/with-title.hoc';
import { snackbarError } from '../../actions/snackbar.actions';

type Props = {
  company_id: number,
  emailDesignCreate: (data: any) => void,
  goToList: () => void,
  goToListDetail: (id) => void,
  snackbarError: (msg: string) => void,
};

export class EmailTemplateCreate extends Component<Props> {
  onSave = (id: number, data: *) => {
    this.props.emailDesignCreate(data, {
      onSuccess: (templateId) => {
        this.props.goToListDetail(templateId);
      },
    });
  };

  render() {
    return (
      <Context.Consumer>
        {(context) => (
          <EmailEditorPanel
            company_id={this.props.company_id}
            save_email={this.onSave}
            hideLeftMenuAction={context.hideLeftMenuAction}
            showLeftMenuAction={context.showLeftMenuAction}
            emailLoad=""
            goToList={this.props.goToList}
            displayEmptyError={this.props.snackbarError}
          />
        )}
      </Context.Consumer>
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
      goToList: () => push('/email-template'),
      goToListDetail: (id) => push(`/email-template/${id}`),
    },
  ),
)(EmailTemplateCreate);
