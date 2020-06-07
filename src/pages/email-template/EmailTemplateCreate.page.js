// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withTranslation } from 'react-i18next';
import { push } from 'connected-react-router';
import {
  emailDesignCreate,
  setEmailEditorHasBeenLoaded,
} from '../../libs/email-editor/actions';
import { Context } from '../../context';

import EmailEditorPanel from '../../libs/email-editor/components/EmailEditor.component';
import withTitle from '../../hocs/with-title.hoc';
import { snackbarError } from '../../actions/snackbar.actions';

import { fetchTagList } from '../../libs/notification-rule/actions';
import { getTagCategories } from '../../libs/notification-rule/selectors';

type Props = {
  company_id: number,
  emailDesignCreate: (data: any) => void,
  goToList: () => void,
  goToListDetail: (id: number) => void,
  snackbarError: (msg: string) => void,

  fetchTagList: () => void,
  tagCategories: { [string]: Array<string> },
  hasBeenLoadedOnce: boolean,
  setHasBeenLoaded: (?boolean) => void,
};

export class EmailTemplateCreate extends Component<Props> {
  componentWillMount() {
    if (this.props.hasBeenLoadedOnce) {
      window.location.reload();
    }
    if (!this.props.hasBeenLoadedOnce) {
      this.props.setHasBeenLoaded(true);
    }
  }

  componentDidMount() {
    this.props.fetchTagList();
    this.props.setHasBeenLoaded();
  }

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
            tags={this.props.tagCategories}
            goToList={this.props.goToList}
            displayEmptyError={this.props.snackbarError}
          />
        )}
      </Context.Consumer>
    );
  }
}

export default compose(
  withTranslation(['emailTemplate']),
  withTitle(({ t }) => t('createTitle')),
  connect(
    (state) => ({
      company_id: state.theme.theme.company,
      tagCategories: getTagCategories(state),
      hasBeenLoadedOnce: state.emailTemplate.hasBeenLoadedOnce,
    }),
    {
      fetchTagList,
      snackbarError,
      emailDesignCreate,
      setHasBeenLoaded: setEmailEditorHasBeenLoaded,
      goToList: () => push('/email-template'),
      goToListDetail: (id) => push(`/email-template/${id}`),
    },
  ),
)(EmailTemplateCreate);
