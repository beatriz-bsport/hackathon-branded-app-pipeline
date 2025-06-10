import React, { Component } from 'react';

import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { push } from 'connected-react-router';
import {
  getEmailTemplatesDetail,
  getAllEmailTemplatesDict,
  getEmailTemplateCategories,
  getRequiredTags,
  getRelatedNotificationEvents,
} from '#src/libs/email-editor/selectors';
import { snackbarError } from '#src/libs/snackbar/actions';

import {
  emailTemplateComplete,
  emailTemplateUpdate,
  setEmailEditorHasBeenLoaded,
  emailDesignCreate,
  fetchAllEmailTemplateCategory,
  fetchCurrentTemplateMetadata,
} from '#src/libs/email-editor/actions';

import EmailEditorPanel, {
  SaveEmailsParameters,
} from '#src/libs/email-editor/components/EmailEditor.component';
import { fetchTagList } from '#src/libs/notification-rule/actions';
import { getTagCategories } from '#src/libs/notification-rule/selectors';

import { EmailTemplate } from '#src/libs/email-editor/types';
import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
import { RootState } from '#src/reducers';
import { DrawerContext, DrawerContextValue } from '#src/context';
import withTitle from '#src/hocs/with-title.hoc';
import LinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';

const { trackFormAdd, trackFormSuccess } =
  rudderStackFormTrackingFunctionsRegistry(
    SegmentAnalyticsFormObjectIdentifier.EmailTemplate,
  );
type OwnProps = {
  id: number;
  create: number;
};

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

export class MarketingEmail extends Component<Props> {
  UNSAFE_componentWillMount() {
    if (this.props.hasBeenLoadedOnce) {
      window.location.reload();
    }
    if (!this.props.hasBeenLoadedOnce) {
      this.props.setHasBeenLoaded(true);
    }
  }

  componentDidMount() {
    // check if the page fully loaded
    // to improve later
    if (!this.props.hasBeenLoadedOnce) trackFormAdd(this.props.id);
    this.props.emailTemplateComplete(this.props.id);
    this.props.fetchTagList();
    this.props.fetchAllEmailTemplateCategory();
    this.props.fetchCurrentTemplateMetadata(this.props.id);
  }

  onSave = ({ id, data, options }: SaveEmailsParameters) => {
    if (this.props.create === 1) {
      this.props.emailDesignCreate(
        {
          ...data,
          company_id: this.props.companyId,
        },
        {
          onSuccess: () => {
            trackFormSuccess();
            if (options?.onSuccess) {
              options.onSuccess();
            }
          },
          onError: options?.onError,
        },
      );
      this.props.goToList();
    } else {
      if (!id || !data) {
        this.props.snackbarError('No data found to save');
        return;
      }
      this.props.emailTemplateUpdate(
        id,
        {
          ...data,
          company_id: this.props.companyId,
        },
        {
          onSuccess: () => {
            trackFormSuccess(id);
            this.props.goToDetailList(id);
            if (options?.onSuccess) {
              options.onSuccess();
            }
          },
          onError: options?.onError,
        },
      );
    }
  };

  onAutoSave = ({ id, data, options }: SaveEmailsParameters) => {
    if (!id || !data) {
      this.props.snackbarError('No data found to save');
      return;
    }

    this.props.emailTemplateUpdate(id, data, {
      // @ts-expect-error
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    });
  };

  render() {
    if (this.props.loading || !this.props.email_templates_details) {
      return <LinearProgress />;
    }

    const emailTemplateToEdit: EmailTemplate = {
      ...this.props.email_templates_summaries[this.props.id],
      ...this.props.email_templates_details[this.props.id],
    };
    return (
      <DrawerContext.Consumer>
        {(context: DrawerContextValue) => (
          <EmailEditorPanel
            autoSaveEnabled
            autoSaveEmail={this.onAutoSave}
            companyEmail={this.props.companyEmail}
            companyId={this.props.companyId}
            companyName={this.props.companyName}
            displayEmptyError={this.props.snackbarError}
            emailTemplateCategories={this.props.emailTemplateCategories}
            emailToEdit={emailTemplateToEdit}
            goToList={this.props.goToList}
            hideLeftMenuAction={context.hideLeftMenuAction}
            relatedNotificationRuleEvents={
              this.props.relatedNotificationRuleEvents
            }
            requiredTags={this.props.requiredTags}
            saveEmail={this.onSave}
            showLeftMenuAction={context.showLeftMenuAction}
            tags={this.props.tagCategories}
          />
        )}
      </DrawerContext.Consumer>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  email_templates_details: getEmailTemplatesDetail(state),
  email_templates_summaries: getAllEmailTemplatesDict(state),
  loading: state.emailTemplate.detail.loading,
  companyId: state.theme.theme.company,
  companyName: state.theme.theme.company_name,
  companyEmail: state.auth.username,
  tagCategories: getTagCategories(state),
  hasBeenLoadedOnce: state.emailTemplate.hasBeenLoadedOnce,
  emailTemplateCategories: getEmailTemplateCategories(state),
  requiredTags: getRequiredTags(state),
  relatedNotificationRuleEvents: getRelatedNotificationEvents(state),
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
  fetchAllEmailTemplateCategory,
  fetchCurrentTemplateMetadata,
};

export default compose(
  withTranslation(['emailTemplate']),
  routerParamsToProps({ id: 'id:number', create: 'create:number' }),
  withTitle(({ t }: { t: TFunction }) => t('editTitle')),
  connect(mapStateToProps, mapDispatchToProps),
)(MarketingEmail);
