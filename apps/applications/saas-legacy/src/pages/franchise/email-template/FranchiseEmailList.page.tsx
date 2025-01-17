import React, { useCallback, useEffect } from 'react';

import { compose } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import {
  createStyles,
  Grid,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import { push as pushAction } from 'connected-react-router';
import { WithTranslation, withTranslation } from 'react-i18next';
import LinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';

import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import {
  emailTemplateDelete as emailTemplateDeleteAction,
  emailTemplateDetail as emailTemplateDetailAction,
  emailTemplateDuplicate as emailTemplateDuplicateAction,
  emailTemplatesSummaries as emailTemplatesSummariesAction,
  fetchFranchisePageFilter as fetchFranchisePageFilterAction,
  updateFranchisePageFilter as updateFranchisePageFilterAction,
} from '#src/libs/email-editor/actions';
import {
  getAllEmailTemplatesSummaries,
  getEmailTemplatesDetail,
  getFranchisorSavedFilter,
} from '#src/libs/email-editor/selectors';
import BottomActionButtons from '#src/components/button/BottomActionsButton.component';
import FranchiseEmailListing from '#src/libs/franchise/components/FranchiseEmailListing.components';
import HTMLPreview from '#src/components/html/HTMLPreview.component';
import { getFranchiseCompanies } from '#src/libs/franchise/selectors';
import { fetchFranchise as fetchFranchiseAction } from '#src/libs/franchise/actions';
import { FranchiseCompany } from '#src/libs/franchise/types';
import ModalConfirm from '#src/components/ModalConfirm.component';

import { RootState } from '../../../reducers';

type OwnProps = {
  id: number;
  companies: FranchiseCompany[];
};

type Props = OwnProps &
  ConnectedProps<typeof connector> &
  WithStyles<typeof styles> &
  WithTranslation;

const FranchiseEmailList = (props: Props) => {
  const {
    emails,
    emailDetail,
    id,
    companies,
    savedFilter,
    emailListLoading,
    emailDetailLoading,
    fetchFranchise,
    fetchFranchisePageFilter,
    updateFranchisePageFilter,
    emailTemplateDetail,
    emailTemplatesSummaries,
    emailTemplateDuplicate,
    deleteTemplate,
    push,
    classes,
    t,
  } = props;

  useEffect(() => {
    fetchFranchise();
    emailTemplatesSummaries();
    fetchFranchisePageFilter();
     
  }, [emailTemplatesSummaries, fetchFranchise, fetchFranchisePageFilter]);

  useEffect(() => {
    if (id) {
      emailTemplateDetail(id);
    }
  }, [emailTemplateDetail, id]);

  const [emailTemplateToDelete, setEmailTemplateToDelete] = React.useState<
    number | null
  >(null);

  const handleOpenDeleteModal = React.useCallback(
    (emailTemplateId: number) => setEmailTemplateToDelete(emailTemplateId),
    [],
  );

  const handleCloseDeleteModal = React.useCallback(
    () => setEmailTemplateToDelete(null),
    [],
  );

  const navigateToCreate = () => {
    push('/f/email-template/create');
  };

  const navigateTo = useCallback(
    (emailId: number) => {
      push(`/f/email-template/${emailId}`);
    },
    [push],
  );

  const onEdit = useCallback(
    (emailId: number) => {
      push(`/f/email-template/${emailId}/edit`);
    },
    [push],
  );

  const onDuplicate = useCallback(
    (emailId: number) => {
      emailTemplateDuplicate({
        id: emailId,
        copyTranslation: t('emails.copy'),
        options: {
          onSuccess: (templateId: number) => navigateTo(templateId),
        },
      });
    },
    [navigateTo, emailTemplateDuplicate, t],
  );

  const handleEmailTemplateDelete = useCallback(() => {
    deleteTemplate(emailTemplateToDelete, {
      onSuccess: () => {
        setEmailTemplateToDelete(null);
      },
      onError: () => {
        setEmailTemplateToDelete(null);
      },
    });
  }, [deleteTemplate, emailTemplateToDelete]);

  const saveFilter = (value: boolean) => {
    updateFranchisePageFilter([
      {
        name: 'email-design',
        filters: value ? ['franchised'] : [],
      },
    ]);
  };

  if (emailListLoading) {
    // @ts-expect-error
    return <LinearProgress className={classes.loader} />;
  }

  return (
    <div className={classes.container}>
      <Grid container direction="row" spacing={3} style={{ height: '100%' }}>
        <Grid item className={classes.grid} md={6} xs={12}>
          <FranchiseEmailListing
            useVirtualizedList
            companies={companies}
            emails={emails}
            isGrouped={savedFilter?.includes('franchised') ?? false}
            navigateTo={navigateTo}
            onDelete={handleOpenDeleteModal}
            onDuplicate={onDuplicate}
            onEdit={onEdit}
            saveFilter={saveFilter}
            selectedId={id}
          />
        </Grid>

        <Grid item className={classes.grid} md={6} xs={12}>
          <div className={classes.scroll}>
            <HTMLPreview
              scrolling
              html={emailDetail?.[id]?.html ?? null}
              loading={emailDetailLoading}
              title={t('emails.emptyStateTitle')}
            />
          </div>
        </Grid>
      </Grid>
      <BottomActionButtons
        onCreate={navigateToCreate}
        onCreateLabel={t('emails.create')}
      />
      <ModalConfirm
        handleCancel={handleCloseDeleteModal}
        handleConfirm={handleEmailTemplateDelete}
        open={!!emailTemplateToDelete}
        options={{
          title: 'emailTemplate:modal.delete.title',
          cancel: 'emailTemplate:modal.delete.cancel',
          confirm: 'emailTemplate:modal.delete.confirm',
          Content: () => <p>{t('emailTemplate:modal.delete.content')}</p>,
        }}
      />
    </div>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(2),
      display: 'flex',
      flex: 1,
      height: '100%',
    },
    loader: {
      position: 'relative',
      top: 0 - theme.spacing(2),
      left: 0 - theme.spacing(4),
      width: '100vw',
    },
    scroll: {
      paddingRight: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      overflowY: 'auto',
      maxHeight: '100%',
      height: '100%',
    },
    grid: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      maxHeight: '100%',
    },
  });

const connector = connect(
  (state: RootState) => ({
    emailDetail: getEmailTemplatesDetail(state),
    emails: getAllEmailTemplatesSummaries(state),
    companies: getFranchiseCompanies(state),
    savedFilter: getFranchisorSavedFilter(state),
    emailListLoading: state.emailTemplate.loading,
    emailDetailLoading: state.emailTemplate.detail.loading,
  }),
  {
    emailTemplateDetail: emailTemplateDetailAction,
    emailTemplatesSummaries: emailTemplatesSummariesAction,
    deleteTemplate: emailTemplateDeleteAction,
    emailTemplateDuplicate: emailTemplateDuplicateAction,
    fetchFranchisePageFilter: fetchFranchisePageFilterAction,
    updateFranchisePageFilter: updateFranchisePageFilterAction,
    fetchFranchise: fetchFranchiseAction,
    push: pushAction,
  },
);

export default compose<any, OwnProps>(
  withTranslation(['franchise']),
  withStyles(styles),
  connector,
  routerParamsToProps({ id: 'id:number' }),
  withTranslation(['franchise']),
)(FranchiseEmailList);
