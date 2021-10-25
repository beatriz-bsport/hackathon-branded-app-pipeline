import React, { useEffect } from 'react';

import { compose } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';
import { LinearProgress } from '@material-ui/core';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { DrawerContext, DrawerContextValue } from '../../context';
import { RootState } from '../../reducers';
import { snackbarError as snackbarErrorAction } from '../../actions/snackbar.actions';
import {
  emailDesignCreate as emailDesignCreateAction,
  emailTemplateComplete as emailTemplateCompleteAction,
  emailTemplateUpdate as emailTemplateUpdateAction,
} from '../../libs/email-editor/actions';
import EmailEditorPanel from '../../libs/email-editor/components/EmailEditor.component';

import { EmailTemplate } from '../../libs/email-editor/types';
import {
  getFranchiseCompanies,
  getFranchiseId,
} from '../../libs/franchise/selectors';
import {
  getAllEmailTemplatesDict,
  getEmailTemplatesDetail,
} from '../../libs/email-editor/selectors';
import { fetchTagList as fetchTagListAction } from '../../libs/notification-rule/actions';
import { getTagCategories } from '../../libs/notification-rule/selectors';
import { fetchFranchise as fetchFranchiseAction } from '../../libs/franchise/actions';
import { FranchiseCompany } from '../../libs/franchise/types';

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
  } = props;

  useEffect(() => {
    fetchFranchise();
  }, [fetchFranchise]);

  useEffect(() => {
    emailTemplateComplete(id);
    fetchTagList();
  }, [emailTemplateComplete, fetchTagList, id]);

  const onSave = (
    emailId: number,
    data: EmailTemplate,
    availableCompanies: number[],
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
        },
      },
    );
  };

  const onAutoSave = (emailId: number, data: EmailTemplate) => {
    emailTemplateUpdate(emailId, {
      ...data,
      franchise_id,
    });
  };

  if (loading || !emailTemplatesDetails) {
    return <LinearProgress />;
  }

  return (
    <DrawerContext.Consumer>
      {(context: DrawerContextValue) => (
        <EmailEditorPanel
          saveEmail={onSave}
          autoSaveEnabled
          autoSaveEmail={onAutoSave}
          hideLeftMenuAction={context.hideLeftMenuAction}
          showLeftMenuAction={context.showLeftMenuAction}
          emailToEdit={{
            ...emailTemplatesSummaries[id],
            ...emailTemplatesDetails[id],
          }}
          tags={tagCategories}
          goToList={goToList}
          displayEmptyError={snackbarError}
          companies={companies}
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
    loading: state.emailTemplate.detail.isLoading,
    companies: getFranchiseCompanies(state),
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
  },
);

export default compose<any, OwnProps>(
  routerParamsToProps({ id: 'id:number', create: 'create:number' }),
  connector,
)(FranchiseEmailEditor);
