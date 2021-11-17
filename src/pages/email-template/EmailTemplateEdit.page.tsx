import React, { Component } from 'react';

import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { push } from 'connected-react-router';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import {
  getEmailTemplatesDetail,
  getAllEmailTemplatesDict,
} from '../../libs/email-editor/selectors';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import withTitle from '../../hocs/with-title.hoc';
import { snackbarError } from '../../libs/snackbar/actions';

import {
  emailTemplateComplete,
  emailTemplateUpdate,
  setEmailEditorHasBeenLoaded,
  emailDesignCreate,
} from '../../libs/email-editor/actions';
import { DrawerContext, DrawerContextValue } from '../../context';

import EmailEditorPanel from '../../libs/email-editor/components/EmailEditor.component';
import { fetchTagList } from '../../libs/notification-rule/actions';
import { getTagCategories } from '../../libs/notification-rule/selectors';
import { RootState } from '../../reducers';

import { EmailTemplate } from '../../libs/email-editor/types';

type OwnProps = {
  id: number;
  create: number;
};

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

export class MarketingEmail extends Component<Props> {
  componentWillMount() {
    if (this.props.hasBeenLoadedOnce) {
      window.location.reload();
    }
    if (!this.props.hasBeenLoadedOnce) {
      this.props.setHasBeenLoaded(true);
    }
  }

  componentDidMount() {
    this.props.emailTemplateComplete(this.props.id);
    this.props.fetchTagList();
  }

  onSave = (id: number, data: EmailTemplate) => {
    if (this.props.create === 1) {
      this.props.emailDesignCreate({
        ...data,
        company_id: this.props.company_id,
      });
      this.props.goToList();
    } else {
      this.props.emailTemplateUpdate(id, {
        ...data,
        company_id: this.props.company_id,
      });
      this.props.goToDetailList(id);
    }
  };

  onAutoSave = (id: number, data: any) => {
    this.props.emailTemplateUpdate(id, data);
  };

  render() {
    if (this.props.loading || !this.props.email_templates_details) {
      return <LinearProgress />;
    }
    return (
      <DrawerContext.Consumer>
        {(context: DrawerContextValue) => (
          <EmailEditorPanel
            saveEmail={this.onSave}
            autoSaveEnabled
            autoSaveEmail={this.onAutoSave}
            hideLeftMenuAction={context.hideLeftMenuAction}
            showLeftMenuAction={context.showLeftMenuAction}
            emailToEdit={{
              ...this.props.email_templates_summaries[this.props.id],
              ...this.props.email_templates_details[this.props.id],
            }}
            tags={this.props.tagCategories}
            company_name={this.props.company_name}
            goToList={this.props.goToList}
            displayEmptyError={this.props.snackbarError}
          />
        )}
      </DrawerContext.Consumer>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  email_templates_details: getEmailTemplatesDetail(state),
  email_templates_summaries: getAllEmailTemplatesDict(state),
  loading: state.emailTemplate.detail.isLoading,
  company_id: state.theme.theme.company,
  company_name: state.theme.theme.company_name,
  tagCategories: getTagCategories(state),
  hasBeenLoadedOnce: state.emailTemplate.hasBeenLoadedOnce,
});

const mapDispatchToProps = {
  fetchTagList,
  setHasBeenLoaded: setEmailEditorHasBeenLoaded,
  snackbarError,
  emailTemplateComplete,
  emailDesignCreate,
  emailTemplateUpdate,
  goToDetailList: (id: number) => push(`/email-template/${id}`),
  goToList: () => push('/email-template'),
};

export default compose(
  withTranslation(['emailTemplate']),
  routerParamsToProps({ id: 'id:number', create: 'create:number' }),
  withTitle(({ t }: { t: TFunction }) => t('editTitle')),
  connect(mapStateToProps, mapDispatchToProps),
)(MarketingEmail);
