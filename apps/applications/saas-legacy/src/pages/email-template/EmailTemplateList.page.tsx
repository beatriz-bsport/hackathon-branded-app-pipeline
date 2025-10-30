import React, { Component } from 'react';

import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose, withState } from 'recompose';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation, WithTranslation } from 'react-i18next';
import Collapse from '@material-ui/core/Collapse';

import { createStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';
import { Divider, IconButton } from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import memoize from 'memoize-one';
import ObjectSearchComponent from '#src/libs/fuzzy-search/components/ObjectSearch.component';
import type { OptionPropsWithData } from '#src/libs/fuzzy-search/types';

import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';

import BottomActionsButton from '#src/components/button/BottomActionsButton.component';
import {
  getEmailTemplatesDetail,
  getAllEmailTemplatesSummaries,
  getEmailTemplateByCategoryWithTemplates,
  getUnavailableEmailTemplatesSummaries,
} from '#src/libs/email-editor/selectors';
import IsEmptyList from '#src/components/navigation/IsEmptyList.component';
import HTMLPreview from '#src/components/html/HTMLPreview.component';
import EmailListItem from '#src/libs/email-editor/components/EmailListItem.components';

import withTitle from '#src/hocs/with-title.hoc';

import {
  emailTemplatesSummaries,
  emailTemplateDetail,
  emailTemplateDelete,
  emailTemplateDuplicate,
  restoreEmailTemplate,
  fetchEmailTemplateBulk,
  fetchAllEmailTemplateCategory,
  upsertEmailTemplateCategory,
  deleteEmailTemplateCategory,
  editOrderEmailTemplate,
  updateEmailTemplateCategoryOrder,
} from '#src/libs/email-editor/actions';
import { fetchResolvedGenericTags as fetchResolvedGenericTagsAction } from '#src/libs/notification-rule/actions';
import { getResolvedGenericTags } from '#src/libs/notification-rule/selectors';
import {
  EmailTemplateCategory,
  EmailTemplateCategoryWithTemplates,
  ResolvedGenericTags,
} from '#src/libs/email-editor/types';
import { CategoryList } from '#src/components/ordering/CategoryList.component';
import CategoryCreationEditDialog from '#src/components/ordering/CategoryCreationEditDialog.component';
import AddCategoryButton from '#src/components/ordering/AddCategoryButton.component';
import EmailTemplateSummary from '#src/libs/email-editor/factories/EmailTemplateSummary';
import { ArchivedSection } from '#src/components/ordering/ArchivedSection.component';
import LinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';

import InfoBox from '#src/components/box/InfoBox.component';
import {
  withObjectSearch,
  WithObjectSearch,
} from '#src/libs/fuzzy-search/components/ObjectSearch.hoc';
import ModalConfirm from '#src/components/ModalConfirm.component';
import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';

import { RootState } from '#src/reducers';
import { MaterialStyleType } from '#src/utils/types';
import { OptionCallback } from '#src/state/types';

const { trackFormAdd, trackFormCancel, trackFormSuccess } =
  rudderStackFormTrackingFunctionsRegistry(
    SegmentAnalyticsFormObjectIdentifier.CategoryEmail,
  );

type OwnProps = {
  goToEdit: (id: number) => void;
  goToList: () => void;
  emailTemplateDelete: (id: number, options?: OptionCallback) => void;
  emailTemplateDetail: (id: number) => void;
  emailTemplateDuplicate: (props: {
    id: number;
    copyTranslation: string;
    options: OptionCallback<number>;
  }) => void;
  emailTemplatesSummaries: () => void;
  email_templates_details: any;
  company_id: number;
  goToCreate: () => void;
  email_templates: Array<EmailTemplateSummary>;
  id: number;
  loading: boolean;
  listLoading: boolean;
  selectTemplate: (id: number) => void;
  unavailableEmailTemplateSummaries: Array<EmailTemplateSummary>;
  restoreEmailTemplate: (id: number) => void;

  emailTemplateCategories: Array<EmailTemplateCategoryWithTemplates>;
  fetchAllEmailTemplateCategory: (companyId?: number) => void;
  upsertEmailTemplateCategory: (
    category: EmailTemplateCategory,
    options?: OptionCallback,
  ) => void;
  deleteEmailTemplateCategory: (
    category: EmailTemplateCategoryWithTemplates,
    options?: OptionCallback<EmailTemplateCategoryWithTemplates>,
  ) => void;
  editOrderEmailTemplate: (
    data: Array<{ id: number; ordering_in_category: number }>,
    options?: OptionCallback,
  ) => void;
  updateEmailTemplateCategoryOrder: (
    data: Array<{ id: number; category_ordering: number }>,
    options?: OptionCallback,
  ) => void;
  categoryLoading: boolean;
  fetchEmailTemplateBulk: (ids: Array<number>) => void;
  expandCollapseLaunchingEmails: boolean;
  setExpandCollapseLaunchingEmails: (
    expandCollapseLaunchingEmails: boolean,
  ) => void;
  resolvedGenericTags: ResolvedGenericTags;
  fetchResolvedGenericTags: () => void;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation &
  WithObjectSearch;

type State = {
  selectedCategory: EmailTemplateCategory | null;
  showCategoryDialog: boolean;
  emailTemplateToDelete: number | null;
};

type EmailTemplateOption = {
  label: string;
  email: EmailTemplateSummary;
  navigateTo: (id: number) => void;
  onEdit?: (id: number) => void;
  onDuplicate: (id: number) => void;
  onDelete?: (id: number) => void;
  value: number;
};

const searchBarAdditionalParams = { available: true };

const Option: React.FC<OptionPropsWithData<EmailTemplateOption>> = (props) => (
  <EmailListItem {...props.data} />
);

export class MarketingEmail extends Component<Props, State> {
  state: State = {
    selectedCategory: null,
    showCategoryDialog: false,
    emailTemplateToDelete: null,
  };

  componentDidMount() {
    const emailTemplateId = this.props.id;
    this.props.emailTemplatesSummaries();
    this.props.fetchAllEmailTemplateCategory(this.props.company_id);
    if (emailTemplateId === undefined) {
      return;
    }
    if (isNaN(emailTemplateId)) {
      this.props.goToList();
      return;
    }
    if (emailTemplateId) {
      this.props.emailTemplateDetail(emailTemplateId);
    }
    this.props.fetchResolvedGenericTags();
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    const emailTemplateId = this.props.id;
    if (emailTemplateId === undefined) {
      return;
    }
    if (isNaN(emailTemplateId)) {
      this.props.goToList();
      return;
    }
    if (emailTemplateId !== prevProps.id) {
      this.props.emailTemplateDetail(emailTemplateId);
    }
  }

  handleOpenDeleteModal = (id: number) =>
    this.setState({ emailTemplateToDelete: id });

  handleCloseDeleteModal = () => this.setState({ emailTemplateToDelete: null });

  handleEmailTemplateDelete = () =>
    this.props.emailTemplateDelete(this.state.emailTemplateToDelete, {
      onSuccess: () => {
        this.setState({ emailTemplateToDelete: null });
        this.props.refreshOptions('email_design', searchBarAdditionalParams);
      },
      onError: () => {
        this.setState({ emailTemplateToDelete: null });
      },
    });

  emailTemplateOptionsFormatter = (
    emailTemplates: EmailTemplateSummary[],
  ): EmailTemplateOption[] =>
    emailTemplates.map((emailTemplate) => {
      return {
        label: emailTemplate.name,
        navigateTo: this.selected,
        onDelete:
          emailTemplate.company_id && !emailTemplate.is_default_bsport_template
            ? this.handleOpenDeleteModal
            : undefined,
        onDuplicate: this.onDuplicate,
        onEdit:
          emailTemplate.company_id && !emailTemplate.is_default_bsport_template
            ? this.props.goToEdit
            : undefined,
        email: emailTemplate,
        value: emailTemplate.id,
      };
    });

  onDuplicate = async (idEmail: number) => {
    this.props.emailTemplateDuplicate({
      id: idEmail,
      copyTranslation: this.props.t('copy'),
      options: {
        onSuccess: (templateId) => {
          this.props.selectTemplate(templateId);
        },
      },
    });
  };

  selected = (id: number) => {
    if (this.props.id === id) this.props.goToEdit(id);
    else this.props.selectTemplate(id);
  };

  setShowCategoryDialog = (showCategoryDialog: boolean) => {
    this.setState({ showCategoryDialog });
  };

  onEditCategory = (category: EmailTemplateCategory) => {
    this.setState({ showCategoryDialog: true, selectedCategory: category });
  };

  onDeleteCategory = (category: EmailTemplateCategoryWithTemplates) => {
    this.props.deleteEmailTemplateCategory(category, {
      onSuccess: () =>
        this.props.fetchEmailTemplateBulk(
          category.items.map((item) => item.id),
        ),
    });
    this.setState({ selectedCategory: null });
  };

  render() {
    const { loading, t, classes, email_templates } = this.props;
    const genericBsportTemplates = memoize(
      (templates: Array<EmailTemplateSummary>) =>
        templates?.filter((email) => email.is_default_bsport_template) || [],
    )(email_templates);
    const franchisorTemplates = memoize(
      (templates: Array<EmailTemplateSummary>) =>
        templates?.filter(
          (email) => !email.company_id && !email.is_default_bsport_template,
        ) || [],
    )(email_templates);

    if (this.props.categoryLoading) {
      return <LinearProgress />;
    }
    if (!loading && this.props.email_templates.length === 0) {
      return (
        <IsEmptyList
          button={this.props.t('create')}
          onCreate={this.props.goToCreate}
          onCreateLabel={t('create')}
          text={this.props.t('templateListEmpty')}
        />
      );
    }
    return (
      <div>
        <Grid container direction="row" spacing={3}>
          <Grid item md={6} xs={12}>
            {this.props.email_templates.length > 0 ? (
              <div className={this.props.classes.search}>
                <ObjectSearchComponent
                  additionalParams={searchBarAdditionalParams}
                  components={{
                    Option,
                  }}
                  optionsFormatter={this.emailTemplateOptionsFormatter}
                  placeholder={t('search')}
                  searchedObjectType="email_design"
                  variant="underlined"
                />
              </div>
            ) : null}
            <AddCategoryButton
              onClick={() => {
                trackFormAdd();
              }}
              setShowCategoryDialog={this.setShowCategoryDialog}
            />
            <div className={classes.panel}>
              {this.props.email_templates?.filter((email) => !!email.company_id)
                .length > 0 && (
                <>
                  <Typography className={classes.title} variant="h5">
                    {t('companieEmails')}
                  </Typography>
                  <CategoryList
                    categoryWithItems={this.props.emailTemplateCategories}
                    deleteCategory={this.onDeleteCategory}
                    editCategory={this.onEditCategory}
                    itemLoading={this.props.listLoading}
                    // @ts-expect-error
                    ListItemComponent={EmailListItem}
                    onClickItem={this.selected}
                    onDeleteItem={this.handleOpenDeleteModal}
                    onDuplicateItem={this.onDuplicate}
                    onEditItem={this.props.goToEdit}
                    selectedItem={this.props.id}
                    updateCategoryOrder={
                      this.props.updateEmailTemplateCategoryOrder
                    }
                    updateItemOrder={this.props.editOrderEmailTemplate}
                    width="95%"
                  />
                </>
              )}
              {genericBsportTemplates.length > 0 && (
                <div className={classes.listContainer}>
                  <div className={classes.categoryHeader}>
                    <Typography variant="h5">
                      {t('bsportTemplateEmails')}
                    </Typography>
                    <IconButton
                      onClick={() =>
                        this.props.setExpandCollapseLaunchingEmails(
                          !this.props.expandCollapseLaunchingEmails,
                        )
                      }
                    >
                      {this.props.expandCollapseLaunchingEmails ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                    </IconButton>
                  </div>
                  <Divider className={classes.divider} />
                  <Collapse
                    className={classes.collapse}
                    in={this.props.expandCollapseLaunchingEmails}
                  >
                    <InfoBox content={t('infoBsportTemplateEmails')} />
                    <div className={classes.launchingEmailsList}>
                      <Paper className={classes.list}>
                        <List
                          disablePadding
                          component="nav"
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          {genericBsportTemplates.map(
                            (email: EmailTemplateSummary) => (
                              <EmailListItem
                                key={email.id}
                                email={email}
                                navigateTo={() => {
                                  this.props.selectTemplate(email.id);
                                }}
                                onClick={this.selected}
                                onDuplicate={this.onDuplicate}
                                selected={email.id === this.props.id}
                              />
                            ),
                          )}
                        </List>
                      </Paper>
                    </div>
                  </Collapse>
                </div>
              )}
              {franchisorTemplates.length > 0 && (
                <>
                  <Typography className={classes.title} variant="h5">
                    {t('franchiseEmails')}
                  </Typography>
                  <Paper className={classes.list}>
                    <List
                      disablePadding
                      component="nav"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {franchisorTemplates.map(
                        (email: EmailTemplateSummary) => (
                          <EmailListItem
                            key={email.id}
                            email={email}
                            navigateTo={() => {
                              this.props.selectTemplate(email.id);
                            }}
                            selected={email.id === this.props.id}
                          />
                        ),
                      )}
                    </List>
                  </Paper>
                </>
              )}
              <ArchivedSection
                disabledItems={this.props.unavailableEmailTemplateSummaries}
                ListItemComponent={EmailListItem}
                restoreItem={this.props.restoreEmailTemplate}
                width="95%"
              />
            </div>
          </Grid>
          <Grid item md={6} xs={12}>
            <HTMLPreview
              scrolling
              html={this.props.email_templates_details?.[this.props.id]?.html}
              loading={this.props.loading}
              resolvedGenericTags={this.props.resolvedGenericTags}
              title={this.props.t('preview')}
            />
          </Grid>
        </Grid>
        <BottomActionsButton
          onCreate={this.props.goToCreate}
          onCreateLabel={t('create')}
        />
        {this.state.showCategoryDialog ? (
          <CategoryCreationEditDialog
            categorySelected={this.state.selectedCategory}
            onClose={() => {
              trackFormCancel();
              this.setState({
                showCategoryDialog: false,
                selectedCategory: null,
              });
            }}
            onSubmit={(category) =>
              this.props.upsertEmailTemplateCategory(category, {
                onSuccess: () => trackFormSuccess(),
              })
            }
            open={this.state.showCategoryDialog}
          />
        ) : null}
        <ModalConfirm
          handleCancel={this.handleCloseDeleteModal}
          handleConfirm={this.handleEmailTemplateDelete}
          open={!!this.state.emailTemplateToDelete}
          options={{
            title: 'emailTemplate:modal.delete.title',
            cancel: 'emailTemplate:modal.delete.cancel',
            confirm: 'emailTemplate:modal.delete.confirm',
            Content: () => <p>{t('emailTemplate:modal.delete.content')}</p>,
          }}
        />
      </div>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    panel: {
      maxHeight: '90vh',
      overflow: 'auto',
    },
    list: {
      marginBottom: theme.spacing(4),
    },
    title: {
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(2),
    },
    panelTitle: {
      margin: theme.spacing(1),
    },
    previewTitle: {
      marginBottom: theme.spacing(1),
    },
    previewEmpty: {
      borderRadius: theme.spacing(3),
      border: '1px solid grey',
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: theme.spacing(6),
    },
    emptyMessageText: {
      marginTop: theme.spacing(2),
    },

    search: { marginBottom: theme.spacing(2) },
    searchPaperDisplayed: {
      border: '1px solid',
      // @ts-expect-error
      borderColor: theme.primary_color,
      borderTop: '0px',
    },
    searchPaperHidden: {
      border: '1px solid',
      // @ts-expect-error
      borderColor: theme.primary_color,
      borderTop: '0px',
      boderBottom: '0px',
    },
    listContainer: {
      paddingRight: theme.spacing(2),
    },
    categoryHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: theme.spacing(2),
    },
    divider: {
      marginBottom: theme.spacing(2),
    },
    launchingEmailsList: {
      paddingTop: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    collapse: {
      width: '100%',
      paddingRight: theme.spacing(2),
      paddingLeft: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  });

export default compose(
  withTranslation(['emailTemplate']),
  withStyles(styles),
  routerParamsToProps({ id: 'id:number' }),
  withTitle(({ t }) => t('listTitle')),
  withObjectSearch,
  withState(
    'expandCollapseLaunchingEmails',
    'setExpandCollapseLaunchingEmails',
    true,
  ),
  connect(
    (state: RootState) => ({
      email_templates: getAllEmailTemplatesSummaries(state),

      email_templates_details: getEmailTemplatesDetail(state),
      listLoading: state.emailTemplate.loading,
      loading:
        state.emailTemplate.loading || state.emailTemplate.detail.loading,
      company_id: state.theme.theme.company,
      emailTemplateCategories: getEmailTemplateByCategoryWithTemplates(
        getAllEmailTemplatesSummaries,
      )(state),
      categoryLoading: state.emailTemplate.emailTemplateCategory.loading,
      unavailableEmailTemplateSummaries:
        getUnavailableEmailTemplatesSummaries(state),
      resolvedGenericTags: getResolvedGenericTags(state),
    }),
    {
      emailTemplatesSummaries,
      emailTemplateDetail,
      emailTemplateDuplicate,
      restoreEmailTemplate,
      fetchEmailTemplateBulk,

      emailTemplateDelete,
      goToEdit: (id: number) => push(`/email-template/${id}/edit`),
      goToCreate: () => push('/email-template/create'),
      goToList: () => push('/email-template'),
      selectTemplate: (id: number) => push(`/email-template/${id}`),

      fetchAllEmailTemplateCategory,
      upsertEmailTemplateCategory,
      deleteEmailTemplateCategory,
      editOrderEmailTemplate,
      updateEmailTemplateCategoryOrder,
      fetchResolvedGenericTags: fetchResolvedGenericTagsAction,
    },
  ),
)(MarketingEmail);
