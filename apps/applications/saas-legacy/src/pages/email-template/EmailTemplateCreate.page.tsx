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
} from '#src/libs/email-editor/actions';

import EmailEditorPanel, {
  SaveEmailsParameters,
} from '#src/libs/email-editor/components/EmailEditor.component';
import { snackbarError } from '#src/libs/snackbar/actions';

import { fetchTagList } from '#src/libs/notification-rule/actions';
import { getTagCategories } from '#src/libs/notification-rule/selectors';
import { getEmailTemplateCategories } from '#src/libs/email-editor/selectors';
import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
import { RootState } from '#src/reducers';
import withTitle from '#src/hocs/with-title.hoc';
import { DrawerContext, DrawerContextValue } from '#src/context';
import { OptionCallback } from '#src/state/types';

const { trackFormAdd, trackFormSuccess } =
  rudderStackFormTrackingFunctionsRegistry(
    SegmentAnalyticsFormObjectIdentifier.EmailTemplate,
  );
type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

export class EmailTemplateCreate extends Component<Props> {
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
    if (!this.props.hasBeenLoadedOnce) trackFormAdd();
    this.props.fetchTagList();
    this.props.setHasBeenLoaded();
    this.props.fetchAllEmailTemplateCategory();
  }

  onSave = ({ data }: SaveEmailsParameters) => {
    const options: OptionCallback<number> = {
      onSuccess: (templateId: number) => {
        this.props.goToListDetail(templateId);
        trackFormSuccess();
      },
    };
    this.props.emailDesignCreate(
      {
        ...data,
        company_id: this.props.companyId,
      },
      options,
    );
  };

  render() {
    return (
      <DrawerContext.Consumer>
        {(context: DrawerContextValue) => (
          <EmailEditorPanel
            companyEmail={this.props.companyEmail}
            companyId={this.props.companyId}
            companyName={this.props.companyName}
            displayEmptyError={this.props.snackbarError}
            emailTemplateCategories={this.props.emailTemplateCategories}
            goToList={this.props.goToList}
            hideLeftMenuAction={context.hideLeftMenuAction}
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
  companyId: state.theme.theme.company,
  companyName: state.theme.theme.company_name,
  companyEmail: state.auth.username,
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
