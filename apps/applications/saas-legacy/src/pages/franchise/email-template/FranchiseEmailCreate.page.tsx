import React, { useEffect } from 'react';

import { compose } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';

import { DrawerContext, DrawerContextValue } from '#src/context';
import { RootState } from '#src/reducers';
import { snackbarError as snackbarErrorAction } from '#src/libs/snackbar/actions';
import {
  emailDesignCreate as emailDesignCreateAction,
  setEmailEditorHasBeenLoaded as setEmailEditorHasBeenLoadedAction,
} from '#src/libs/email-editor/actions';
import EmailEditorPanel, {
  SaveEmailsParameters,
} from '#src/libs/email-editor/components/EmailEditor.component';

import {
  getFranchiseCompanies,
  getFranchiseId,
} from '#src/libs/franchise/selectors';
import { fetchTagList as fetchTagListAction } from '#src/libs/notification-rule/actions';
import { getTagCategories } from '#src/libs/notification-rule/selectors';
import { FranchiseCompany } from '#src/libs/franchise/types';
import { fetchFranchise as fetchFranchiseAction } from '#src/libs/franchise/actions';

type OwnProps = {
  companies: FranchiseCompany[];
};

type Props = OwnProps & ConnectedProps<typeof connector>;

const FranchiseEmailCreate = (props: Props) => {
  const {
    franchiseId,
    franchiseEmail,
    franchiseName,
    tagCategories,
    companies,
    snackbarError,
    goToList,
    goToListDetail,
    emailDesignCreate,
    fetchTagList,
    fetchFranchise,
  } = props;

  useEffect(() => {
    fetchFranchise();
    fetchTagList();
  }, [fetchTagList, fetchFranchise]);

  const onSave = ({ data, availableCompanies }: SaveEmailsParameters) => {
    if (!franchiseId) {
      console.error('Franchise ID is not defined');
      return;
    }
    emailDesignCreate(
      {
        ...data,
        franchise_id: franchiseId,
        available_for_companies: availableCompanies,
      },
      {
        onSuccess: (templateId: number) => {
          goToListDetail(templateId);
        },
      },
    );
  };

  return (
    <DrawerContext.Consumer>
      {(context: DrawerContextValue) => {
        if (!franchiseId) return null;
        return (
          <EmailEditorPanel
            companies={companies}
            companyEmail={franchiseEmail}
            companyName={franchiseName}
            displayEmptyError={snackbarError}
            franchiseId={franchiseId}
            goToList={goToList}
            hideLeftMenuAction={context.hideLeftMenuAction}
            saveEmail={onSave}
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
    hasBeenLoadedOnce: state.emailTemplate.hasBeenLoadedOnce,
    tagCategories: getTagCategories(state),
    companies: getFranchiseCompanies(state),
  }),
  {
    fetchFranchise: fetchFranchiseAction,
    fetchTagList: fetchTagListAction,
    setEmailEditorHasBeenLoaded: setEmailEditorHasBeenLoadedAction,
    snackbarError: snackbarErrorAction,
    emailDesignCreate: emailDesignCreateAction,
    goToList: () => push('/f/email-template'),
    goToListDetail: (id: number) => push(`/f/email-template/${id}`),
  },
);

export default compose<any, OwnProps>(connector)(FranchiseEmailCreate);
