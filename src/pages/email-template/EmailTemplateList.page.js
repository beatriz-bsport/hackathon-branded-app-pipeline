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
} from '../../libs/email-editor/actions';
import EmailCard from '../../libs/email-editor/components/EmailTemplateListItem.component';

type Props = {
  goToEdit: (id: number) => void,
  emailTemplateDelete: (id: number) => void,
  goToCreateFromExisting: (id: number) => void,
  emailTemplateDetail: (id: number) => void,
  emailTemplatesSummaries: () => void,
  email_templates_details: any,
  goToCreate: () => void,
  email_templates_summaries: any,
  email_templates_list: any,
  t: TFunction,
  classes: Object,
  id: number,
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

  selected(id) {
    this.props.selectTemplate(id);
  }

  render() {
    const { email_templates_summaries, t } = this.props;
    return (
      <Grid container direction="row" spacing={24}>
        <Grid item xs={12} md={6}>
          <Paper className={this.props.classes.panel}>
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
                  onClickEdit={this.props.goToEdit}
                  onClickDelete={this.props.emailTemplateDelete}
                  onClickAdd={this.props.goToCreateFromExisting}
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
            className={this.props.classes.previewTitle}
          >
            {t('preview')}
          </Typography>
          {this.state.selected_id &&
          !!this.props.email_templates_details[this.state.selected_id] ? (
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
          ) : (
            <div className={this.props.classes.previewEmpty}>
              <InfoIcon fontSize="large" color="disabled" />
              <Typography
                className={this.props.classes.emptyMessageText}
                color="textSecondary"
              >
                {t('selectToShowPreview')}
              </Typography>
            </div>
          )}
        </Grid>
        <BottomActionsButton
          onCreateLabel={t('create')}
          onCreate={this.props.goToCreate}
        />
      </Grid>
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
      emailTemplateDelete,
      goToEdit: (id) => push(`/email/edit/${id}`),
      goToCreate: () => push('/email/create'),
      goToCreateFromExisting: (id) => push(`/email/edit/${id}/1`),
      selectTemplate: (id) => push(`/email/list/${id}`),
    },
  ),
)(MarketingEmail);
