import React, { useCallback, useEffect } from 'react';

import { compose } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';

import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import { snackbarError as snackbarErrorAction } from '#src/libs/snackbar/actions';
import {
  emailDesignCreate as emailDesignCreateAction,
  emailTemplateComplete as emailTemplateCompleteAction,
  emailTemplateUpdate as emailTemplateUpdateAction,
  fetchCurrentTemplateMetadata as fetchCurrentTemplateMetadataAcion,
} from '#src/libs/email-editor/actions';
import EmailEditorPanel, {
  SaveEmailsParameters,
} from '#src/libs/email-editor/components/EmailEditor.component';

import {
  getFranchiseCompanies,
  getFranchiseId,
} from '#src/libs/franchise/selectors';
import {
  getAllEmailTemplatesDict,
  getEmailTemplatesDetail,
  getRelatedNotificationEvents,
  getRequiredTags,
} from '#src/libs/email-editor/selectors';
import { fetchTagList as fetchTagListAction } from '#src/libs/notification-rule/actions';
import { getTagCategories } from '#src/libs/notification-rule/selectors';
import { fetchFranchise as fetchFranchiseAction } from '#src/libs/franchise/actions';
import { FranchiseCompany } from '#src/libs/franchise/types';
import { RootState } from '#src/reducers';
import { DrawerContext, DrawerContextValue } from '#src/context';
import LinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';

type OwnProps = {
  id: number;
  companies: FranchiseCompany[];
};

type Props = OwnProps & ConnectedProps<typeof connector>;

const FranchiseEmailEditor = (props: Props) => {
  const {
    id,
    franchiseId,
    franchiseName,
    franchiseEmail,
    loading,
    emailTemplatesDetails,
    emailTemplatesSummaries,
    tagCategories,
    companies,
    emailTemplateComplete,
    goToList,
    goToListDetail,
    emailTemplateUpdate,
    snackbarError,
    fetchTagList,
    fetchFranchise,
    fetchCurrentTemplateMetadata,
    requiredTags,
    relatedNotificationRuleEvents,
  } = props;
  const [shouldBlockNavigation, setShouldBlockNavigation] =
    React.useState(false);

  useEffect(() => {
    fetchFranchise();
  }, [fetchFranchise]);

  useEffect(() => {
    if (id === undefined || isNaN(id)) {
      goToList();
      return;
    }
    setShouldBlockNavigation(true);
  }, [goToList, id]);

  useEffect(() => {
    emailTemplateComplete(id);
    fetchTagList();
  }, [emailTemplateComplete, fetchTagList, id]);

  useEffect(() => {
    fetchCurrentTemplateMetadata(id);
  }, [fetchCurrentTemplateMetadata, id]);

  const onSave = useCallback(
    ({
      id: emailId,
      data,
      availableCompanies,
      options,
    }: SaveEmailsParameters) => {
      if (!franchiseId) {
        console.error('No franchise found to attach the email.');
        return;
      }
      if (!emailId || !data) {
        snackbarError('No data to be saved found.');
        return;
      }
      emailTemplateUpdate(
        emailId,
        {
          ...data,
          franchise_id: franchiseId,
          available_for_companies: availableCompanies,
        },
        {
          onSuccess: (templateId: number) => {
            goToListDetail(templateId);
            if (options?.onSuccess) {
              options.onSuccess();
            }
          },
          onError: options?.onError,
        },
      );
    },
    [emailTemplateUpdate, goToListDetail, franchiseId, snackbarError],
  );

  const onAutoSave = useCallback(
    ({ id: emailId, data, options }: SaveEmailsParameters) => {
      if (!franchiseId) {
        console.error('No franchise found to attach the email.');
        return;
      }
      if (!emailId || !data) {
        snackbarError('No data to be saved found.');
        return;
      }
      emailTemplateUpdate(
        emailId,
        {
          ...data,
          franchise_id: franchiseId,
        },
        {
          // @ts-expect-error
          onSuccess: options?.onSuccess,
          onError: options?.onError,
        },
      );
    },
    [emailTemplateUpdate, snackbarError, franchiseId],
  );

  const emailToEdit = React.useMemo(
    () => ({
      ...emailTemplatesSummaries[id],
      ...emailTemplatesDetails[id],
    }),
    // eslint-disable-next-line
    [emailTemplatesSummaries[id], emailTemplatesDetails[id]],
  );

  if (loading || !emailTemplatesDetails) {
    return <LinearProgress />;
  }

  return (
    <DrawerContext.Consumer>
      {(context: DrawerContextValue) => {
        if (!franchiseId) return null;
        return (
          <EmailEditorPanel
            autoSaveEnabled
            autoSaveEmail={onAutoSave}
            companies={emailToEdit.company_id ? [] : companies}
            companyEmail={franchiseEmail}
            companyName={franchiseName}
            displayEmptyError={snackbarError}
            emailToEdit={emailToEdit}
            franchiseId={franchiseId}
            goToList={goToList}
            hideLeftMenuAction={context.hideLeftMenuAction}
            relatedNotificationRuleEvents={relatedNotificationRuleEvents}
            requiredTags={requiredTags}
            saveEmail={onSave}
            shouldBlockNavigation={shouldBlockNavigation}
            showLeftMenuAction={context.showLeftMenuAction}
            tags={tagCategories}
          />
        );
      }}
    </DrawerContext.Consumer>
  );
};

const connector = connect(
  (state: RootState) => ({
    franchiseName: state.theme.theme.company_name,
    franchiseEmail: state.auth.username,
    franchiseId: getFranchiseId(state),
    emailTemplatesDetails: getEmailTemplatesDetail(state),
    emailTemplatesSummaries: getAllEmailTemplatesDict(state),
    tagCategories: getTagCategories(state),
    loading: state.emailTemplate.detail.loading,
    companies: getFranchiseCompanies(state),
    requiredTags: getRequiredTags(state),
    relatedNotificationRuleEvents: getRelatedNotificationEvents(state),
  }),
  {
    fetchFranchise: fetchFranchiseAction,
    fetchTagList: fetchTagListAction,
    snackbarError: snackbarErrorAction,
    emailTemplateUpdate: emailTemplateUpdateAction,
    emailDesignCreate: emailDesignCreateAction,
    emailTemplateComplete: emailTemplateCompleteAction,
    goToList: () => push('/f/email-template'),
    goToListDetail: (id: number) => push(`/f/email-template/${id}`),
    fetchCurrentTemplateMetadata: fetchCurrentTemplateMetadataAcion,
  },
);

export default compose<any, OwnProps>(
  routerParamsToProps({ id: 'id:number', create: 'create:number' }),
  connector,
)(FranchiseEmailEditor);
