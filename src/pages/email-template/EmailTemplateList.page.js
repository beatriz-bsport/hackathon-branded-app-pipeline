// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { compose } from 'recompose';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import InfoIcon from '@material-ui/icons/Info';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import BottomActionsButton from '../../components/button/BottomActionsButton.component';
import {
  getAllEmailTemplatesDict,
  getEmailTemplatesDetail,
  getAllEmailTemplatesId,
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
  email_templates_summaries: any,
  email_templates_list: any,
  t: TFunction,
  classes: Object,
  id: number,
  loading: boolean,
  selectTemplate: (id: number) => void,
};

export class MarketingEmail extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      selected_id: null,
    };
  }

  componentDidMount() {
    this.props.emailTemplatesSummaries();
    if (this.props.id) {
      this.props.emailTemplateDetail(this.props.id);
      this.setState({
        selected_id: this.props.id,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.id !== prevProps.id) {
      this.props.emailTemplateDetail(this.props.id);
      this.setState({ selected_id: this.props.id });
    }
  }

  onDuplicate = async (id) => {
    await this.props.emailTemplateDetail(id);
    const data = {
      design: this.props.email_templates_details[id].design,
      html: this.props.email_templates_details[id].html,
      title: `${this.props.email_templates_summaries[id].title} (${this.props.t(
        'copy',
      )})`,
      subject: this.props.email_templates_summaries[id].subject,
    };
    this.props.emailDesignCreate(data, {
      onSuccess: (templateId) => {
        this.props.selectTemplate(templateId);
      },
    });
  };

  renderEmptyOrPreview() {
    if (
      this.state.selected_id &&
      !!this.props.email_templates_details[this.state.selected_id]
    ) {
      return (
        <Paper>
          <div
            dangerouslySetInnerHTML={{
              __html: this.props.email_templates_details
                ? this.props.email_templates_details[this.state.selected_id]
                    .html
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
    const { email_templates_summaries, loading, t, classes } = this.props;
    if (!loading && this.props.email_templates_list.length === 0) {
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
        <Grid container direction="row" spacing={24}>
          <Grid item xs={12} md={6}>
            <Paper className={classes.panel}>
              <List
                component="nav"
                disablePadding
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {this.props.email_templates_list.map((emailId) => (
                  <EmailCard
                    onClick={(id) => {
                      this.selected(id);
                    }}
                    email_template={email_templates_summaries[emailId]}
                    onClickDuplicate={this.onDuplicate}
                    onClickDelete={this.props.emailTemplateDelete}
                    selected={emailId === this.state.selected_id}
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
    margin: theme.spacing.unit,
  },
  previewTitle: {
    marginBottom: theme.spacing.unit,
  },
  previewEmpty: {
    borderRadius: theme.spacing.unit * 3,
    border: '1px solid grey',
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: theme.spacing.unit * 6,
  },
  emptyMessageText: {
    marginTop: theme.spacing.unit * 2,
  },
  emptyTextContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing.unit * 2,
  },
});

export default compose(
  withNamespaces(['emailTemplate']),
  withStyles(styles),
  routerParamsToProps({ id: 'id:number' }),
  withTitle(({ t }) => t('listTitle')),
  connect(
    (state) => ({
      email_templates_summaries: getAllEmailTemplatesDict(state),
      email_templates_list: getAllEmailTemplatesId(state),
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
