// @flow

import React, { Component } from 'react';

import { compose } from 'recompose';
import EmailEditor from 'react-email-editor';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';

import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import moment from 'moment';
import { EmailTemplate } from '../types';
import i18n from '../../../../i18n';

type Props = {
  save_email: (number, any) => void,
  company_id: number,
  emailLoad: EmailTemplate,
  t: TFunction,
  company_name: string,
  classes: Object,
  displayEmptyError: (msg: string) => void,
  goToList: () => void,
};

type State = {
  subject: string,
  title: string,
};

export class EmailEditorPanel extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      title: props.emailLoad ? props.emailLoad.title : '',
      subject: props.emailLoad ? props.emailLoad.subject : '',
    };
  }

  exportHtml = () => {
    this.editor.exportHtml((data) => {
      const { design, html } = data;
      if (this.state.title === '') {
        this.props.displayEmptyError(this.props.t('editor.error.title'));
      } else if (Object.keys(design.counters).length === 2) {
        this.props.displayEmptyError(this.props.t('editor.error.content'));
      } else {
        this.props.save_email(this.props.emailLoad.id, {
          title: this.state.title,
          subject: this.state.subject,
          html,
          design: JSON.stringify(design),
          company: this.props.company_id,
          date_created: moment(),
        });
      }
    });
  };

  handleTitleChange(title) {
    this.setState({ title });
  }

  handleObjectChange(subject) {
    this.setState({ subject });
  }

  onLoad() {
    window.unlayer.loadDesign(this.props.emailLoad.design);
  }

  render() {
    const { t, classes } = this.props;
    return (
      <div>
        <div className={classes.paper}>
          <TextField
            onChange={(event) => this.handleTitleChange(event.target.value)}
            label={t('editor.title')}
            value={this.state.title}
            required
            className={classes.field}
          />
          <TextField
            onChange={(event) => this.handleObjectChange(event.target.value)}
            label={t('editor.subject')}
            value={this.state.subject}
            className={classes.field}
          />
        </div>
        <Paper>
          <EmailEditor
            ref={(editor) => {
              this.editor = editor;
            }}
            minHeight="80vh"
            locale={i18n.language}
            onLoad={() => this.onLoad()}
            options={{
              mergeTags: {
                first_name: {
                  name: 'First Name',
                  value: '{{firstname}}',
                },
                last_name: {
                  name: 'Last Name',
                  value: '{{lastname}}',
                },
              },
              designTags: {
                business_name: this.props.company_name,
              },
            }}
          />
        </Paper>
        <div className={classes.buttonsContainer}>
          <Button
            color="secondary"
            variant="contained"
            className={classes.button}
            onClick={this.props.goToList}
          >
            {t('editor.cancel')}
          </Button>
          <Button
            color="primary"
            variant="contained"
            className={classes.button}
            onClick={this.exportHtml}
          >
            {t('editor.save')}
          </Button>
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
  field: {
    margin: theme.spacing.unit,
  },
  paper: {
    marginBottom: theme.spacing.unit * 2,
    display: 'flex',
    flexDirection: 'column',
  },
  button: {
    marginLeft: theme.spacing.unit,
    marginTop: theme.spacing.unit,
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(['emailTemplate']),
)(EmailEditorPanel);
