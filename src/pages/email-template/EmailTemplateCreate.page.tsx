import React, { Component } from 'react';

import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { push } from 'connected-react-router';
import {
  emailDesignCreate,
  setEmailEditorHasBeenLoaded,
  fetchAllEmailTemplateCategory,
} from '../../libs/email-editor/actions';
import { DrawerContext, DrawerContextValue } from '../../context';

import EmailEditorPanel from '../../libs/email-editor/components/EmailEditor.component';
import withTitle from '../../hocs/with-title.hoc';
import { snackbarError } from '../../libs/snackbar/actions';

import { fetchTagList } from '../../libs/notification-rule/actions';
import { getTagCategories } from '../../libs/notification-rule/selectors';
import { RootState } from '../../reducers';
import { EmailTemplate } from '../../libs/email-editor/types';
import { getEmailTemplateCategories } from '#libs/email-editor/selectors';

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

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
    this.props.fetchAllEmailTemplateCategory();
  }

  onSave = (id: number, data: EmailTemplate) => {
    this.props.emailDesignCreate(
      {
        ...data,
        company_id: this.props.company_id,
      },
      {
        onSuccess: (templateId: number) => {
          this.props.goToListDetail(templateId);
        },
      },
    );
  };

  render() {
    return (
      <DrawerContext.Consumer>
        {(context: DrawerContextValue) => (
          <EmailEditorPanel
            saveEmail={this.onSave}
            hideLeftMenuAction={context.hideLeftMenuAction}
            showLeftMenuAction={context.showLeftMenuAction}
            tags={this.props.tagCategories}
            goToList={this.props.goToList}
            displayEmptyError={this.props.snackbarError}
            emailTemplateCategories={this.props.emailTemplateCategories}
          />
        )}
      </DrawerContext.Consumer>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  company_id: state.theme.theme.company,
  tagCategories: getTagCategories(state),
  hasBeenLoadedOnce: state.emailTemplate.hasBeenLoadedOnce,
  emailTemplateCategories: getEmailTemplateCategories(state),
});

const mapDispatchToProps = {
  fetchTagList,
  snackbarError,
  emailDesignCreate,
  setHasBeenLoaded: setEmailEditorHasBeenLoaded,
  goToList: () => push('/email-template'),
  goToListDetail: (id: number) => push(`/email-template/${id}`),
  fetchAllEmailTemplateCategory,
};

export default compose(
  withTranslation(['emailTemplate']),
  withTitle(({ t }: { t: TFunction }) => t('createTitle')),
  connect(mapStateToProps, mapDispatchToProps),
)(EmailTemplateCreate);
