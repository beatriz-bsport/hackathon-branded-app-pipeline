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
} from '#libs/email-editor/selectors';
import { snackbarError } from '#libs/snackbar/actions';

import {
  emailTemplateComplete,
  emailTemplateUpdate,
  setEmailEditorHasBeenLoaded,
  emailDesignCreate,
  fetchAllEmailTemplateCategory,
  fetchCurrentTemplateMetadata,
} from '#libs/email-editor/actions';

import EmailEditorPanel from '#libs/email-editor/components/EmailEditor.component';
import { fetchTagList } from '#libs/notification-rule/actions';
import { getTagCategories } from '#libs/notification-rule/selectors';

import { EmailTemplate } from '#libs/email-editor/types';
import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';
import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';
import { RootState } from '../../reducers';
import { DrawerContext, DrawerContextValue } from '../../context';
import withTitle from '../../hocs/with-title.hoc';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { OptionCallback } from '../../state/types';

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

  onSave = (
    id: number,
    data: EmailTemplate,
    availableCompanies?: number[],
    options?: OptionCallback,
  ) => {
    if (this.props.create === 1) {
      this.props.emailDesignCreate(
        {
          ...data,
          company_id: this.props.company_id,
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
      this.props.emailTemplateUpdate(
        id,
        {
          ...data,
          company_id: this.props.company_id,
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

  onAutoSave = (
    id: number,
    data: any,
    availableCompanies?: number[],
    options?: OptionCallback,
  ) => {
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
    return (
      <DrawerContext.Consumer>
        {(context: DrawerContextValue) => (
          <EmailEditorPanel
            autoSaveEnabled
            autoSaveEmail={this.onAutoSave}
            company_name={this.props.company_name}
            displayEmptyError={this.props.snackbarError}
            emailTemplateCategories={this.props.emailTemplateCategories}
            emailToEdit={{
              ...this.props.email_templates_summaries[this.props.id],
              ...this.props.email_templates_details[this.props.id],
            }}
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
  company_id: state.theme.theme.company,
  company_name: state.theme.theme.company_name,
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
