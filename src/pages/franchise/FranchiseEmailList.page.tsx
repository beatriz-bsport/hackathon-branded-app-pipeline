import React, { useEffect } from 'react';

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
import { TFunction } from 'i18next';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import { RootState } from '../../reducers';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import {
  emailTemplateDelete as emailTemplateDeleteAction,
  emailTemplateDetail as emailTemplateDetailAction,
  emailTemplateDuplicate as emailTemplateDuplicateAction,
  emailTemplatesSummaries as emailTemplatesSummariesAction,
  fetchFranchisePageFilter as fetchFranchisePageFilterAction,
  updateFranchisePageFilter as updateFranchisePageFilterAction,
} from '../../libs/email-editor/actions';
import {
  getAllEmailTemplatesSummaries,
  getEmailTemplatesDetail,
  getFranchisorSavedFilter,
} from '../../libs/email-editor/selectors';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';
import FranchiseEmailListing from '../../libs/franchise/components/FranchiseEmailListing.components';
import { EmailTemplateSummary } from '../../libs/email-editor/types';
import EmailPreview from '../../libs/email-editor/components/EmailPreview.components';
import { getFranchiseCompanyById } from '../../libs/franchise/selectors';
import { fetchFranchise as fetchFranchiseAction } from '../../libs/franchise/actions';
import withTitle from '../../hocs/with-title.hoc';

type OwnProps = {
  id: number;
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
    companiesById,
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

  const navigateToCreate = () => {
    push('/f/email-template/create');
  };

  const navigateTo = (emailId: number) => () => {
    push(`/f/email-template/${emailId}`);
  };

  const onEdit = (emailId: number) => () => {
    push(`/f/email-template/${emailId}/edit`);
  };

  const onDuplicate = (emailId: number) => () => {
    emailTemplateDuplicate({
      id: emailId,
      copyTranslation: t('emails.copy'),
      options: {
        onSuccess: (templateId: number) => navigateTo(templateId)(),
      },
    });
  };

  const onDelete = (emailId: number) => () => {
    deleteTemplate(emailId);
  };

  const saveFilter = (value: boolean) => {
    updateFranchisePageFilter([
      {
        name: 'email-design',
        filters: value ? ['franchised'] : [],
      },
    ]);
  };

  if (emailListLoading) {
    return <LinearProgress className={classes.loader} />;
  }

  return (
    <div className={classes.container}>
      <Grid container direction="row" spacing={3}>
        <Grid item xs={12} md={6}>
          <FranchiseEmailListing
            companyDic={companiesById}
            isGrouped={savedFilter?.includes('franchised') ?? false}
            franchiseEmails={[...emails]
              .filter((email) => email.company_id === null)
              .sort(orderByTitle)}
            companiesEmails={[...emails]
              .filter((email) => email.company_id !== null)
              .sort(orderByTitle)}
            selectedId={id}
            navigateTo={navigateTo}
            onEdit={onEdit}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
            saveFilter={saveFilter}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <div>
            <EmailPreview
              title={t('emails.emptyStateTitle')}
              html={emailDetail?.[id]?.html ?? null}
              loading={emailDetailLoading}
            />
          </div>
        </Grid>
      </Grid>
      <BottomActionButtons
        onCreateLabel={t('emails.create')}
        onCreate={navigateToCreate}
      />
    </div>
  );
};

const orderByTitle = (a: EmailTemplateSummary, b: EmailTemplateSummary) =>
  a.title.localeCompare(b.title);

const styles = (theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(2),
    },
    loader: {
      position: 'relative',
      top: 0 - theme.spacing(2),
      left: 0 - theme.spacing(4),
      width: '100vw',
    },
  });

const connector = connect(
  (state: RootState) => ({
    emailDetail: getEmailTemplatesDetail(state),
    emails: getAllEmailTemplatesSummaries(state),
    companiesById: getFranchiseCompanyById(state),
    savedFilter: getFranchisorSavedFilter(state),
    emailListLoading: state.emailTemplate.isLoading,
    emailDetailLoading: state.emailTemplate.detail.isLoading,
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
  withTitle(({ t }: { t: TFunction }) => t('emails.pageTitle')),
)(FranchiseEmailList);
