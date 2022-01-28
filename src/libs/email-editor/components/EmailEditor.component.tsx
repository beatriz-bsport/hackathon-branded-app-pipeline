import React, { Component, createRef } from 'react';

import { compose } from 'recompose';
import EmailEditor, { Design } from 'react-email-editor';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import { Prompt } from 'react-router-dom';
import { createStyles, WithStyles } from '@material-ui/styles';
import { Theme, Typography } from '@material-ui/core';
import moment from 'moment-timezone';
import { WithTranslation, withTranslation } from 'react-i18next';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';

import Checkbox from '../../../components/input/Checkbox.component';
import {
  EmailTemplate,
  EmailTemplateCategory,
  EmailTemplateSummary,
} from '../types';
import i18n from '../../../i18n';
import { FranchiseCompany } from '../../franchise/types';
import { OptionTypeBase } from '../../../components/Selector/MaterialUISelector.component';
import FranchiseCompaniesSelector from '../../franchise/components/FranchiseCompaniesSelector.component';
import CategorySelector from '#components/ordering/CategorySelector.component';

export type OwnProps = {
  autoSaveEnabled?: boolean;
  emailToEdit?: EmailTemplate & EmailTemplateSummary;
  company_name?: string;
  tags?: { [tag_name: string]: string[] };
  companies?: FranchiseCompany[];
  saveEmail: (
    id: number,
    data: Omit<EmailTemplate, 'id'>,
    availableCompanies?: number[],
  ) => void;
  autoSaveEmail?: (
    id: number,
    data: Omit<EmailTemplate, 'id'>,
    availableCompanies?: number[],
  ) => void;
  displayEmptyError: (msg: string) => void;
  goToList: () => void;
  hideLeftMenuAction: () => void;
  showLeftMenuAction: () => void;
  emailTemplateCategories?: Array<EmailTemplateCategory>;
};

type Props = OwnProps & WithStyles<typeof styles> & WithTranslation;

type State = {
  subject: string;
  title: string;
  autoSave: boolean;
  notReadyToLeave: boolean;
  selectedCompanies: OptionTypeBase[];
  categoryId: number;
};

export class EmailEditorPanel extends Component<Props, State> {
  interval: any;

  companyDic: Record<number, FranchiseCompany>;

  intervalPeriod: number;

  editor = createRef<EmailEditor>();

  constructor(props: Props) {
    super(props);

    this.companyDic = this.props?.companies?.reduce<
      Record<number, FranchiseCompany>
    >((dic, company) => {
      // eslint-disable-next-line no-param-reassign
      dic[company.id] = company;
      return dic;
    }, {});

    this.state = {
      title: props.emailToEdit?.title ?? '',
      subject: props.emailToEdit?.subject ?? '',
      autoSave: true,
      notReadyToLeave: true,
      selectedCompanies: props.emailToEdit?.available_for_companies?.map(
        (comp) => {
          const _company = this.companyDic?.[comp];
          return {
            value: `${_company.id}`,
            label: _company.name,
          };
        },
      ),
      categoryId: this.props.emailToEdit?.category || null,
    };
    this.intervalPeriod = 60 * 1000; // Run every minutes
  }

  componentDidMount = () => {
    this.props.hideLeftMenuAction();

    if (this.props.autoSaveEmail) {
      this.interval = setInterval(() => {
        this.autoExportHtml();
      }, this.intervalPeriod);
    }
  };

  componentWillUnmount() {
    this.props.showLeftMenuAction();
    clearInterval(this.interval);
  }

  getError = (design: Design): string | null => {
    let error = null;
    if (this.state.title === '') {
      error = 'emailTemplate:editor.error.title';
    } else if (this.state.subject === '') {
      error = 'emailTemplate:editor.error.subject';
    } else if (Object.keys(design.counters).length === 2) {
      error = 'emailTemplate:editor.error.content';
    }
    return error;
  };

  exportHtml = () => {
    this.editor.current.exportHtml(({ design, html }) => {
      if (this.getError(design)) {
        this.props.displayEmptyError(this.props.t(this.getError(design)));
        return;
      }

      this.props.saveEmail(
        this.props.emailToEdit?.id,
        {
          title: this.state.title,
          subject: this.state.subject,
          html,
          design: JSON.stringify(design),
          date_modified: moment(),
          category: this.state.categoryId,
        },
        this.state.selectedCompanies?.map((opt) =>
          parseInt(opt?.value ?? '', 10),
        ),
      );
    });
  };

  autoExportHtml = () => {
    this.editor.current.exportHtml(({ design, html }) => {
      if (this.getError(design)) {
        this.props.displayEmptyError(this.props.t(this.getError(design)));
        return;
      }

      this.props.autoSaveEmail(
        this.props.emailToEdit?.id,
        {
          title: this.state.title,
          subject: this.state.subject,
          html,
          design: JSON.stringify(design),
          date_modified: moment(),
        },
        this.state.selectedCompanies?.map((opt) =>
          parseInt(opt?.value ?? '', 10),
        ),
      );
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
    const url = window.URL.createObjectURL(
      new Blob([this.props.emailToEdit?.html]),
    );
    const tempEl = document.createElement('a');
    tempEl.href = url;
    tempEl.download = `${this.state.title}.html`;
    tempEl.click();
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.props.tags && !prevProps.tags) {
      // unlayer is the library use under the hood by react-email-editor
      window?.unlayer.setMergeTags(this.getMergeTags);
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
    // unlayer is the library use under the hood by react-email-editor
    window?.unlayer.loadDesign(this.props.emailToEdit?.design);
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

  handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
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
            inputProps={{ maxLength: 100 }}
            value={this.state.title}
            required
            className={classes.field}
          />
          <TextField
            onChange={(event) => {
              this.handleObjectChange(event.target.value);
            }}
            label={t('emailTemplate:editor.subject')}
            value={this.state.subject}
            inputProps={{ maxLength: 500 }}
            required
            className={classes.field}
          />
          {this.props.emailTemplateCategories && (
            <CategorySelector
              categories={this.props.emailTemplateCategories}
              onChange={(ev) =>
                this.setState({ categoryId: ev?.value || null })
              }
              selected={this.state.categoryId}
            />
          )}
          {this.props?.companies?.length > 0 && (
            <div className={classes.companies}>
              <Typography variant="body1" className={classes.subtitle}>
                {t('editor.shareWith')}
              </Typography>
              <div className={classes.selector}>
                <FranchiseCompaniesSelector
                  onChange={(newValue) => {
                    this.setState({ selectedCompanies: newValue });
                  }}
                  selectedCompanies={this.state.selectedCompanies}
                  companyDic={this.companyDic}
                  companies={this.props.companies}
                  withAllCompaniesTag
                />
              </div>
              <div className={classes.helper}>
                <Typography variant="caption">
                  {t('editor.shareWithHelper')}
                </Typography>
              </div>
            </div>
          )}
        </div>
        <div className={classes.buttonsContainer}>
          <Button className={classes.button} onClick={this.props.goToList}>
            {t('emailTemplate:editor.cancel')}
          </Button>
          <div className={classes.rightContainer}>
            {this.props.autoSaveEnabled ? (
              <Checkbox
                checked={this.state.autoSave}
                label={t('emailTemplate:autoSave')}
                onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
                  this.handleChange(ev)
                }
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
              ref={this.editor}
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

const styles = (theme: Theme) =>
  createStyles({
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
    subtitle: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
    },
    selector: {
      maxWidth: 400,
    },
    companies: {
      marginLeft: theme.spacing(1),
    },
    helper: {
      color: theme.palette.grey[500],
      marginTop: theme.spacing(1),
    },
  });

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(['emailTemplate', 'notificationRule']),
)(EmailEditorPanel);
