// @flow

import React, { Component } from 'react';

import { compose } from 'recompose';
import EmailEditor from 'react-email-editor';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import { Prompt } from 'react-router-dom';

import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import moment from 'moment-timezone';
import Checkbox from '../../../components/input/Checkbox.component';
import type { EmailTemplate } from '../types';
import i18n from '../../../i18n';

type Props = {
  save_email: (number, any) => void,
  auto_save_email: (number, any) => void,
  auto_save_enabled: ?boolean,
  company_id: number,
  emailLoad: EmailTemplate,
  t: TFunction,
  company_name: string,
  classes: Object,
  displayEmptyError: (msg: string) => void,
  goToList: () => void,
  hideLeftMenuAction: () => void,
  showLeftMenuAction: () => void,
  tags: ?Object,
};

type State = {
  subject: string,
  title: string,
  autoSave: boolean,
  notReadyToLeave: boolean,
};

export class EmailEditorPanel extends Component<Props, State> {
  interval: any;

  intervalPeriod: number;

  constructor(props: Props) {
    super(props);
    this.state = {
      title: props.emailLoad ? props.emailLoad.title : '',
      subject: props.emailLoad ? props.emailLoad.subject : '',
      autoSave: true,
      notReadyToLeave: true,
    };
    this.intervalPeriod = 60000;
  }

  componentWillMount() {
    this.props.hideLeftMenuAction();
  }

  componentDidMount = () => {
    if (this.props.auto_save_email) {
      this.interval = setInterval(() => {
        this.autoExportHtml();
      }, this.intervalPeriod);
    }
  };

  componentWillUnmount() {
    this.props.showLeftMenuAction();
    clearInterval(this.interval);
  }

  exportHtml = () => {
    this.editor.exportHtml((data) => {
      const { design, html } = data;
      if (this.state.title === '') {
        this.props.displayEmptyError(
          this.props.t('emailTemplate:editor.error.title'),
        );
      } else if (Object.keys(design.counters).length === 2) {
        this.props.displayEmptyError(
          this.props.t('emailTemplate:editor.error.content'),
        );
      } else {
        this.props.save_email(this.props.emailLoad.id, {
          title: this.state.title,
          subject: this.state.subject,
          html,
          design: JSON.stringify(design),
          company: this.props.company_id,
          date_modified: moment(),
        });
      }
    });
  };

  autoExportHtml = () => {
    this.editor.exportHtml((data) => {
      const { design, html } = data;
      if (this.state.title === '') {
        this.props.displayEmptyError(
          this.props.t('emailTemplate:editor.error.title'),
        );
      } else if (Object.keys(design.counters).length === 2) {
        this.props.displayEmptyError(
          this.props.t('emailTemplate:editor.error.content'),
        );
      } else {
        this.props.auto_save_email(this.props.emailLoad.id, {
          title: this.state.title,
          subject: this.state.subject,
          html,
          design: JSON.stringify(design),
          company: this.props.company_id,
          date_modified: moment(),
        });
      }
    });
  };

  handleTitleChange(title: string) {
    this.setState({ title });
  }

  handleObjectChange(subject: string) {
    this.setState({ subject });
  }

  handlSaveClick = () => {
    this.setState({ notReadyToLeave: false });
    this.exportHtml();
  };

  handleExportClick = () => {
    const url = window.URL.createObjectURL(new Blob([this.props.emailLoad.html]));
    const tempEl = document.createElement('a');
    tempEl.href = url;
    tempEl.download = `${this.state.title}.html`;
    tempEl.click();
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.props.tags && !prevProps.tags) {
      window.unlayer.setMergeTags(this.getMergeTags);
    }
    if (prevState.autoSave && !this.state.autoSave) {
      clearInterval(this.interval);
    }
    if (!prevState.autoSave && this.state.autoSave) {
      this.interval = setInterval(() => {
        this.autoExportHtml();
      }, this.intervalPeriod);
    }
  }

  onLoad() {
    window.unlayer.loadDesign(this.props.emailLoad.design);
  }

  getMergeTags = () => {
    if (this.props.tags) {
      return Object.entries(this.props.tags).reduce(
        (acc, [tagCategory, tagList]) => ({
          ...acc,
          [tagCategory]: {
            name: this.props.t(`notificationRule:tag.${tagCategory}.name`),
            mergeTags: tagList.reduce(
              (tagListAcc, tag) => ({
                ...tagListAcc,
                [tag]: {
                  name: this.props.t(
                    `notificationRule:tag.${tagCategory}.tags.${tag}`,
                  ),
                  value: `{${tag}}`,
                },
              }),
              {},
            ),
          },
        }),
        {},
      );
    }
    return null;
  };

  handleChange = (ev: Event) => {
    this.setState({ autoSave: ev.target.checked });
  };

  render() {
    const { t, classes } = this.props;
    const mergeTags = this.getMergeTags();
    return (
      <div>
        <div className={classes.paper}>
          <Prompt
            when={this.state.notReadyToLeave}
            message={this.props.t('emailTemplate:leaveAlert')}
          />
          <TextField
            onChange={(event) => this.handleTitleChange(event.target.value)}
            label={t('emailTemplate:editor.title')}
            value={this.state.title}
            required
            className={classes.field}
          />
          <TextField
            onChange={(event) => this.handleObjectChange(event.target.value)}
            label={t('emailTemplate:editor.subject')}
            value={this.state.subject}
            className={classes.field}
          />
        </div>
        <div className={classes.buttonsContainer}>
          <Button className={classes.button} onClick={this.props.goToList}>
            {t('emailTemplate:editor.cancel')}
          </Button>
          <div className={classes.rightContainer}>
            {this.props.auto_save_enabled ? (
              <Checkbox
                checked={this.state.autoSave}
                label={t('emailTemplate:autoSave')}
                onChange={(ev) => this.handleChange(ev)}
              />
            ) : null}
            <Button
              color="primary"
              variant="contained"
              className={classes.button}
              onClick={this.handlSaveClick}
            >
              {t('emailTemplate:editor.save')}
            </Button>
            <Button
              color="primary"
              variant="contained"
              className={classes.button}
              onClick={this.handleExportClick}
            >
              {t('emailTemplate:editor.exportHtml')}
            </Button>
          </div>
        </div>
        <Paper>
          {!!Object.entries(mergeTags).length && (
            <EmailEditor
              ref={(editor) => {
                this.editor = editor;
              }}
              minHeight="80vh"
              locale={i18n.language}
              translations={{
                'fr-FR': {
                  'labels.merge_tags': 'Ajouter une variable',
                },
                'en-US': {
                  'labels.merge_tags': 'Add a variable',
                },
              }}
              onLoad={() => this.onLoad()}
              options={{
                mergeTags,
                designTags: {
                  business_name: this.props.company_name,
                },
              }}
            />
          )}
        </Paper>
      </div>
    );
  }
}

const styles = (theme) => ({
  field: {
    margin: theme.spacing(1),
  },
  paper: {
    marginBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  button: {
    marginLeft: theme.spacing(1),
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
  },
  rightContainer: {
    display: 'flex',
    alignItems: 'center',
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['emailTemplate', 'notificationRule']),
)(EmailEditorPanel);
