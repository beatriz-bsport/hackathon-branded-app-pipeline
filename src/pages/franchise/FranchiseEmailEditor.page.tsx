import React, { useCallback, useEffect } from 'react';

import { compose } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';

import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import { snackbarError as snackbarErrorAction } from '#libs/snackbar/actions';
import {
  emailDesignCreate as emailDesignCreateAction,
  emailTemplateComplete as emailTemplateCompleteAction,
  emailTemplateUpdate as emailTemplateUpdateAction,
  fetchCurrentTemplateMetadata as fetchCurrentTemplateMetadataAcion,
} from '#libs/email-editor/actions';
import EmailEditorPanel from '#libs/email-editor/components/EmailEditor.component';

import { EmailTemplate } from '#libs/email-editor/types';
import {
  getFranchiseCompanies,
  getFranchiseId,
} from '#libs/franchise/selectors';
import {
  getAllEmailTemplatesDict,
  getEmailTemplatesDetail,
  getRelatedNotificationEvents,
  getRequiredTags,
} from '#libs/email-editor/selectors';
import { fetchTagList as fetchTagListAction } from '#libs/notification-rule/actions';
import { getTagCategories } from '#libs/notification-rule/selectors';
import { fetchFranchise as fetchFranchiseAction } from '#libs/franchise/actions';
import { FranchiseCompany } from '#libs/franchise/types';
import { RootState } from '../../reducers';
import { DrawerContext, DrawerContextValue } from '../../context';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import type { OptionCallback } from '../../state/types';

type OwnProps = {
  id: number;
  companies: FranchiseCompany[];
};

type Props = OwnProps & ConnectedProps<typeof connector>;

const FranchiseEmailEditor = (props: Props) => {
  const {
    id,
    franchise_id,
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

  useEffect(() => {
    fetchFranchise();
  }, [fetchFranchise]);

  useEffect(() => {
    emailTemplateComplete(id);
    fetchTagList();
  }, [emailTemplateComplete, fetchTagList, id]);

  useEffect(() => {
    fetchCurrentTemplateMetadata(id);
  }, [fetchCurrentTemplateMetadata, id]);

  const onSave = useCallback(
    (
      emailId: number,
      data: EmailTemplate,
      availableCompanies: number[],
      options?: OptionCallback,
    ) => {
      emailTemplateUpdate(
        emailId,
        {
          ...data,
          franchise_id,
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
    [emailTemplateUpdate, goToListDetail, franchise_id],
  );

  const onAutoSave = useCallback(
    (
      emailId: number,
      data: EmailTemplate,
      availableCompanies?: number[],
      // @ts-expect-error
      options: OptionCallback,
    ) => {
      emailTemplateUpdate(
        emailId,
        {
          ...data,
          franchise_id,
        },
        {
          // @ts-expect-error
          onSuccess: options?.onSuccess,
          onError: options?.onError,
        },
      );
    },
    [emailTemplateUpdate, franchise_id],
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
      {(context: DrawerContextValue) => (
        <EmailEditorPanel
          autoSaveEnabled
          autoSaveEmail={onAutoSave}
          companies={emailToEdit.company_id ? [] : companies}
          displayEmptyError={snackbarError}
          emailToEdit={emailToEdit}
          goToList={goToList}
          hideLeftMenuAction={context.hideLeftMenuAction}
          relatedNotificationRuleEvents={relatedNotificationRuleEvents}
          requiredTags={requiredTags}
          saveEmail={onSave}
          showLeftMenuAction={context.showLeftMenuAction}
          tags={tagCategories}
        />
      )}
    </DrawerContext.Consumer>
  );
};

const connector = connect(
  (state: RootState) => ({
    franchise_id: getFranchiseId(state),
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
