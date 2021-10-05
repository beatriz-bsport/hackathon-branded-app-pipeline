import React, { useEffect } from 'react';

import { compose } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';

import { DrawerContext, DrawerContextValue } from '../../context';
import { RootState } from '../../reducers';
import { snackbarError as snackbarErrorAction } from '../../actions/snackbar.actions';
import {
  emailDesignCreate as emailDesignCreateAction,
  setEmailEditorHasBeenLoaded as setEmailEditorHasBeenLoadedAction,
} from '../../libs/email-editor/actions';
import EmailEditorPanel from '../../libs/email-editor/components/EmailEditor.component';
import { EmailTemplate } from '../../libs/email-editor/types';

import { getFranchiseId } from '../../libs/franchise/selectors';
import { fetchTagList as fetchTagListAction } from '../../libs/notification-rule/actions';
import { getTagCategories } from '../../libs/notification-rule/selectors';

type OwnProps = {};

type Props = OwnProps & ConnectedProps<typeof connector>;

const FranchiseEmailCreate = (props: Props) => {
  const {
    franchise_id,
    tagCategories,
    snackbarError,
    goToList,
    goToListDetail,
    emailDesignCreate,
    fetchTagList,
  } = props;

  useEffect(() => {
    fetchTagList();
  }, [fetchTagList]);

  const onSave = (id: number, data: EmailTemplate) => {
    emailDesignCreate(
      {
        ...data,
        franchise_id,
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
      {(context: DrawerContextValue) => (
        <EmailEditorPanel
          saveEmail={onSave}
          hideLeftMenuAction={context.hideLeftMenuAction}
          showLeftMenuAction={context.showLeftMenuAction}
          tags={tagCategories}
          goToList={goToList}
          displayEmptyError={snackbarError}
        />
      )}
    </DrawerContext.Consumer>
  );
};

const connector = connect(
  (state: RootState) => ({
    franchise_id: getFranchiseId(state),
    hasBeenLoadedOnce: state.emailTemplate.hasBeenLoadedOnce,
    tagCategories: getTagCategories(state),
  }),
  {
    fetchTagList: fetchTagListAction,
    setEmailEditorHasBeenLoaded: setEmailEditorHasBeenLoadedAction,
    snackbarError: snackbarErrorAction,
    emailDesignCreate: emailDesignCreateAction,
    goToList: () => push('/f/email-template'),
    goToListDetail: (id: number) => push(`/f/email-template/${id}`),
  },
);

export default compose<any, OwnProps>(connector)(FranchiseEmailCreate);
