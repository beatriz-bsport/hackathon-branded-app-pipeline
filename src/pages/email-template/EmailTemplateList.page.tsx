// @ts-nocheck
// @flow

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
import FuzeSearch from '#components/FuzeSearch.component';

import routerParamsToProps from '#hocs/router-params-to-props.hoc';

import BottomActionsButton from '#components/button/BottomActionsButton.component';
import {
  getEmailTemplatesDetail,
  getAllEmailTemplatesSummaries,
  getEmailTemplateByCategoryWithTemplates,
  getUnavailableEmailTemplatesSummaries,
} from '#libs/email-editor/selectors';
import IsEmptyList from '#components/navigation/IsEmptyList.component';
import HTMLPreview from '#components/html/HTMLPreview.component';
import EmailListItem from '#libs/email-editor/components/EmailListItem.components';

import withTitle from '#hocs/with-title.hoc';

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
} from '#libs/email-editor/actions';
import { fetchResolvedGenericTags as fetchResolvedGenericTagsAction } from '#libs/notification-rule/actions';
import { getResolvedGenericTags } from '#libs/notification-rule/selectors';
import {
  EmailTemplateCategory,
  EmailTemplateCategoryWithTemplates,
  ResolvedGenericTags,
} from '#libs/email-editor/types';
import { OptionCallback } from '../../state/types';
import { CategoryList } from '#components/ordering/CategoryList.component';
import CategoryCreationEditDialog from '#components/ordering/CategoryCreationEditDialog.component';
import AddCategoryButton from '#components/ordering/AddCategoryButton.component';
import EmailTemplateSummary from '#libs/email-editor/factories/EmailTemplateSummary';
import { ArchivedSection } from '#components/ordering/ArchivedSection.component';
import { MaterialStyleType } from '../../utils/types';
import { RootState } from '../../reducers';
import LinearProgress from '#components/navigation/BackofficeLinearProgress.component';

import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';
import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';
import InfoBox from '#components/box/InfoBox.component';

const { trackFormAdd, trackFormCancel, trackFormSuccess } =
  rudderStackFormTrackingFunctionsRegistry(
    SegmentAnalyticsFormObjectIdentifier.CategoryEmail,
  );

type OwnProps = {
  goToEdit: (id: number) => void;
  emailTemplateDelete: (id: number) => void;
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
  WithTranslation;

type State = {
  searchText: string;
  searchResult: Array<EmailTemplateSummary>;
  selectedCategory: EmailTemplateCategory | null;
  showCategoryDialog: boolean;
};

export class MarketingEmail extends Component<Props, State> {
  state: State = {
    searchText: '',
    searchResult: [],
    selectedCategory: null,
    showCategoryDialog: false,
  };

  componentDidMount() {
    this.props.emailTemplatesSummaries();
    this.props.fetchAllEmailTemplateCategory(this.props.company_id);
    if (this.props.id) {
      this.props.emailTemplateDetail(this.props.id);
    }
    this.props.fetchResolvedGenericTags();
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    if (this.props.id !== prevProps.id) {
      this.props.emailTemplateDetail(this.props.id);
    }
  }

  changeSearch = (fuse: EmailTemplateSummary) => (ev: any) => {
    this.setState({
      searchText: ev.target.value,
      searchResult: fuse.search(ev.target.value),
    });
  };

  clearSearch = () => {
    this.setState({ searchText: '', searchResult: [] });
  };

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
    const buttonEnabled = (email: EmailTemplateSummary) =>
      email.company_id && !email.is_default_bsport_template;

    if (this.props.categoryLoading) {
      return <LinearProgress />;
    }
    if (!loading && this.props.email_templates.length === 0) {
      return (
        <IsEmptyList
          text={this.props.t('templateListEmpty')}
          button={this.props.t('create')}
          onCreate={this.props.goToCreate}
          onCreateLabel={t('create')}
        />
      );
    }
    return (
      <div>
        <Grid container direction="row" spacing={3}>
          <Grid item xs={12} md={6}>
            {this.props.email_templates.length > 0 ? (
              <div className={this.props.classes.search}>
                <FuzeSearch
                  searchText={this.state.searchText}
                  clearSearch={this.clearSearch}
                  changeSearch={this.changeSearch}
                  items={this.props.email_templates}
                  placeholder={t('search')}
                  searchFields={['title', 'subject']}
                  searchResult={this.state.searchResult}
                />
                <Paper
                  className={
                    this.state.searchResult.length > 0 &&
                    this.state.searchText !== ''
                      ? this.props.classes.searchPaperDisplayed
                      : this.props.classes.searchPaperHidden
                  }
                >
                  <Collapse
                    in={
                      this.state.searchResult.length > 0 &&
                      this.state.searchText !== ''
                    }
                  >
                    <List
                      component="nav"
                      disablePadding
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {this.state.searchResult.map((email) => (
                        <EmailListItem
                          key={`search-${email.id}`}
                          email={email}
                          selected={email.id === this.props.id}
                          navigateTo={this.selected}
                          onEdit={
                            buttonEnabled(email)
                              ? this.props.goToEdit
                              : undefined
                          }
                          onDuplicate={
                            email.company_id &&
                            !email.is_default_bsport_template
                              ? this.onDuplicate
                              : undefined
                          }
                          onDelete={
                            email.company_id &&
                            !email.is_default_bsport_template
                              ? this.props.emailTemplateDelete
                              : undefined
                          }
                          search={this.state.searchText}
                        />
                      ))}
                    </List>
                  </Collapse>
                </Paper>
              </div>
            ) : null}
            <AddCategoryButton
              setShowCategoryDialog={this.setShowCategoryDialog}
              onClick={() => {
                trackFormAdd();
              }}
            />
            <div className={classes.panel}>
              {this.props.email_templates?.filter((email) => !!email.company_id)
                .length > 0 && (
                <>
                  <Typography className={classes.title} variant="h5">
                    {t('companieEmails')}
                  </Typography>
                  <CategoryList
                    onClickItem={this.selected}
                    onDeleteItem={this.props.emailTemplateDelete}
                    updateItemOrder={this.props.editOrderEmailTemplate}
                    updateCategoryOrder={
                      this.props.updateEmailTemplateCategoryOrder
                    }
                    selectedItem={this.props.id}
                    categoryWithItems={this.props.emailTemplateCategories}
                    onEditItem={this.props.goToEdit}
                    editCategory={this.onEditCategory}
                    deleteCategory={this.onDeleteCategory}
                    ListItemComponent={EmailListItem}
                    onDuplicateItem={this.onDuplicate}
                    width="95%"
                    itemLoading={this.props.listLoading}
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
                          component="nav"
                          disablePadding
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
                                selected={email.id === this.props.id}
                                navigateTo={() => {
                                  this.props.selectTemplate(email.id);
                                }}
                                onClick={this.selected}
                                onDuplicate={this.onDuplicate}
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
                      component="nav"
                      disablePadding
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
                            selected={email.id === this.props.id}
                            navigateTo={() => {
                              this.props.selectTemplate(email.id);
                            }}
                          />
                        ),
                      )}
                    </List>
                  </Paper>
                </>
              )}
              <ArchivedSection
                disabledItems={this.props.unavailableEmailTemplateSummaries}
                restoreItem={this.props.restoreEmailTemplate}
                ListItemComponent={EmailListItem}
                width="95%"
              />
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <HTMLPreview
              title={this.props.t('preview')}
              html={this.props.email_templates_details?.[this.props.id]?.html}
              loading={this.props.loading}
              scrolling
              resolvedGenericTags={this.props.resolvedGenericTags}
            />
          </Grid>
        </Grid>
        <BottomActionsButton
          onCreateLabel={t('create')}
          onCreate={this.props.goToCreate}
        />
        {this.state.showCategoryDialog ? (
          <CategoryCreationEditDialog
            open={this.state.showCategoryDialog}
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
            categorySelected={this.state.selectedCategory}
          />
        ) : null}
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
      borderColor: theme.primary_color,
      borderTop: '0px',
    },
    searchPaperHidden: {
      border: '1px solid',
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
