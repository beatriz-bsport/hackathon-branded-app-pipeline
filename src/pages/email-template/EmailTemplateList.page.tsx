// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose } from 'recompose';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation, WithTranslation } from 'react-i18next';
import Collapse from '@material-ui/core/Collapse';

import { createStyles, Theme } from '@material-ui/styles';
import FuzeSearch from '../../components/FuzeSearch.component';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import BottomActionsButton from '../../components/button/BottomActionsButton.component';
import {
  getEmailTemplatesDetail,
  getAllEmailTemplatesSummaries,
  getEmailTemplateByCategoryWithTemplates,
  getUnavailableEmailTemplatesSummaries,
} from '../../libs/email-editor/selectors';
import IsEmptyList from '../../components/navigation/IsEmptyList.component';
import EmailPreview from '../../libs/email-editor/components/EmailPreview.components';
import EmailListItem from '../../libs/email-editor/components/EmailListItem.components';

import withTitle from '../../hocs/with-title.hoc';

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
} from '../../libs/email-editor/actions';
import {
  EmailTemplateCategory,
  EmailTemplateCategoryWithTemplates,
} from '../../libs/email-editor/types';
import { OptionCallback } from '../../state/types';
import { CategoryList } from '../../components/ordering/CategoryList.component';
import CategoryCreationEditDialog from '../../components/ordering/CategoryCreationEditDialog.component';
import AddCategoryButton from '../../components/ordering/AddCategoryButton.component';
import EmailTemplateSummary from '../../libs/email-editor/factories/EmailTemplateSummary';
import { ArchivedSection } from '../../components/ordering/ArchivedSection.component';
import { MaterialStyleType } from '../../utils/types';
import { RootState } from '../../reducers';
import LinearProgress from '#components/navigation/BackofficeLinearProgress.component';

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
  goToCreate: () => void;
  email_templates: Array<EmailTemplateSummary>;
  id: number;
  loading: boolean;
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
    this.props.fetchAllEmailTemplateCategory();
    if (this.props.id) {
      this.props.emailTemplateDetail(this.props.id);
    }
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
    const { loading, t, classes } = this.props;
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
                          navigateTo={() => {
                            this.selected(email.id);
                          }}
                          onEdit={
                            email.company_id
                              ? () => {
                                  this.props.goToEdit(email.id);
                                }
                              : undefined
                          }
                          onDuplicate={
                            email.company_id
                              ? () => {
                                  this.onDuplicate(email.id);
                                }
                              : undefined
                          }
                          onDelete={
                            email.company_id
                              ? () => {
                                  this.props.emailTemplateDelete(email.id);
                                }
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
                    itemLoading={loading}
                  />
                </>
              )}
              {this.props?.email_templates?.filter((email) => !email.company_id)
                ?.length > 0 && (
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
                      {this.props.email_templates
                        .filter((email) => !email.company_id)
                        .map((email) => (
                          <EmailListItem
                            key={email.id}
                            email={email}
                            selected={email.id === this.props.id}
                            navigateTo={() => {
                              this.props.selectTemplate(email.id);
                            }}
                          />
                        ))}
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
            <EmailPreview
              title={this.props.t('preview')}
              html={this.props.email_templates_details?.[this.props.id]?.html}
              loading={this.props.loading}
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
            onClose={() =>
              this.setState({
                showCategoryDialog: false,
                selectedCategory: null,
              })
            }
            onSubmit={this.props.upsertEmailTemplateCategory}
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
    divider: {
      marginBottom: theme.spacing(2),
    },
  });

export default compose(
  withTranslation(['emailTemplate']),
  withStyles(styles),
  routerParamsToProps({ id: 'id:number' }),
  withTitle(({ t }) => t('listTitle')),
  connect(
    (state: RootState) => ({
      email_templates: getAllEmailTemplatesSummaries(state),

      email_templates_details: getEmailTemplatesDetail(state),
      loading:
        state.emailTemplate.loading || state.emailTemplate.detail.loading,
      company_id: state.theme.theme.company,
      emailTemplateCategories: getEmailTemplateByCategoryWithTemplates(
        getAllEmailTemplatesSummaries,
      )(state),
      categoryLoading: state.emailTemplate.emailTemplateCategory.loading,
      unavailableEmailTemplateSummaries:
        getUnavailableEmailTemplatesSummaries(state),
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
    },
  ),
)(MarketingEmail);
