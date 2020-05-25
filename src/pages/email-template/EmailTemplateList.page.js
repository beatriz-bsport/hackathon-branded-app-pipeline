// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose } from 'recompose';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import InfoIcon from '@material-ui/icons/Info';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import Collapse from '@material-ui/core/Collapse';

import FuzeSearch from '../../components/FuzeSearch.component';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import BottomActionsButton from '../../components/button/BottomActionsButton.component';
import {
  getEmailTemplatesDetail,
  getAllEmailTemplatesSummaries,
} from '../../libs/email-editor/selectors';

import withTitle from '../../hocs/with-title.hoc';

import {
  emailTemplatesSummaries,
  emailTemplateDetail,
  emailTemplateDelete,
  emailDesignCreate,
} from '../../libs/email-editor/actions';
import EmailCard from '../../libs/email-editor/components/EmailTemplateListItem.component';

type Props = {
  goToEdit: (id: number) => void,
  emailTemplateDelete: (id: number) => void,
  emailTemplateDetail: (id: number) => void,
  emailTemplatesSummaries: () => void,
  email_templates_details: any,
  emailDesignCreate: (any) => void,
  goToCreate: () => void,
  email_templates: any,
  t: TFunction,
  classes: Object,
  id: number,
  loading: boolean,
  selectTemplate: (id: number) => void,
};

export class MarketingEmail extends Component<Props> {
  state = {
    searchText: '',
    searchResult: [],
  };

  componentDidMount() {
    this.props.emailTemplatesSummaries();
    if (this.props.id) {
      this.props.emailTemplateDetail(this.props.id);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.id !== prevProps.id) {
      this.props.emailTemplateDetail(this.props.id);
    }
  }

  changeSearch = (fuse) => (ev) => {
    this.setState({
      searchText: ev.target.value,
      searchResult: fuse.search(ev.target.value),
    });
  };

  clearSearch = () => {
    this.setState({ searchText: '', searchResult: [] });
  };

  onDuplicate = async (idEmail) => {
    await this.props.emailTemplateDetail(idEmail);
    const data = {
      design: this.props.email_templates_details[idEmail].design,
      html: this.props.email_templates_details[idEmail].html,
      title: `${
        this.props.email_templates.find((email) => email.id === idEmail).title
      } (${this.props.t('copy')})`,
      subject: this.props.email_templates.find((email) => email.id === idEmail)
        .subject,
    };
    this.props.emailDesignCreate(data, {
      onSuccess: (templateId) => {
        this.props.selectTemplate(templateId);
      },
    });
  };

  renderEmptyOrPreview() {
    if (this.props.id && !!this.props.email_templates_details[this.props.id]) {
      return (
        <Paper>
          <div
            dangerouslySetInnerHTML={{
              __html: this.props.email_templates_details
                ? this.props.email_templates_details[this.props.id].html
                : null,
            }}
          />
        </Paper>
      );
    }
    return (
      <div className={this.props.classes.previewEmpty}>
        <InfoIcon fontSize="large" color="disabled" />
        <Typography
          className={this.props.classes.emptyMessageText}
          color="textSecondary"
        >
          {this.props.t('selectToShowPreview')}
        </Typography>
      </div>
    );
  }

  selected(id) {
    if (this.props.id === id) this.props.goToEdit(id);
    else this.props.selectTemplate(id);
  }

  render() {
    const { loading, t, classes } = this.props;
    if (!loading && this.props.email_templates.length === 0) {
      return (
        <div className={classes.emptyTextContainer}>
          <Typography align="center" color="textSecondary">
            {t('templateListEmpty')}
          </Typography>
          <BottomActionsButton
            onCreateLabel={t('create')}
            onCreate={this.props.goToCreate}
          />
        </div>
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
                      : this.props.classes.searchPaperHiden
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
                        <EmailCard
                          onClick={(id) => {
                            this.selected(id);
                          }}
                          email_template={email}
                          onClickDuplicate={this.onDuplicate}
                          onClickEdit={(id) => this.props.goToEdit(id)}
                          onClickDelete={this.props.emailTemplateDelete}
                          selected={email.id === this.props.id}
                        />
                      ))}
                    </List>
                  </Collapse>
                </Paper>
              </div>
            ) : null}
            <Paper className={classes.panel}>
              <List
                component="nav"
                disablePadding
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {this.props.email_templates.map((email) => (
                  <EmailCard
                    onClick={(id) => {
                      this.selected(id);
                    }}
                    email_template={email}
                    onClickDuplicate={this.onDuplicate}
                    onClickEdit={(id) => this.props.goToEdit(id)}
                    onClickDelete={this.props.emailTemplateDelete}
                    selected={email.id === this.props.id}
                  />
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h5"
              component="h2"
              className={classes.previewTitle}
            >
              {t('preview')}
            </Typography>
            {this.props.loading ? (
              <LinearProgress />
            ) : (
              this.renderEmptyOrPreview()
            )}
          </Grid>
        </Grid>
        <BottomActionsButton
          onCreateLabel={t('create')}
          onCreate={this.props.goToCreate}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  panel: {
    maxHeight: '90vh',
    overflow: 'auto',
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
  emptyTextContainer: {
    display: 'flex',
    justifyContent: 'center',
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
});

export default compose(
  withTranslation(['emailTemplate']),
  withStyles(styles),
  routerParamsToProps({ id: 'id:number' }),
  withTitle(({ t }) => t('listTitle')),
  connect(
    (state) => ({
      email_templates: getAllEmailTemplatesSummaries(state),

      email_templates_details: getEmailTemplatesDetail(state),
      loading:
        state.emailTemplate.isLoading || state.emailTemplate.detail.isLoading,
      company_id: state.theme.theme.company,
    }),
    {
      emailTemplatesSummaries,
      emailTemplateDetail,
      emailDesignCreate,

      emailTemplateDelete,
      goToEdit: (id) => push(`/email-template/${id}/edit`),
      goToCreate: () => push('/email-template/create'),
      selectTemplate: (id) => push(`/email-template/${id}`),
    },
  ),
)(MarketingEmail);
