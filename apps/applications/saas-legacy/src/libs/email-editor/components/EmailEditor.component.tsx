import React, { Component, createRef } from 'react';
import { DateTime } from 'luxon';
import { compose } from 'recompose';
import EmailEditor, { Design } from 'react-email-editor';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import { Prompt } from 'react-router-dom';
import { createStyles, WithStyles } from '@material-ui/styles';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Theme,
  Typography,
} from '@material-ui/core';
import { WithTranslation, withTranslation } from 'react-i18next';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import memoize from 'memoize-one';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import { Alert } from '@material-ui/lab';
import isEqual from 'lodash/isEqual';
import { AxiosError } from 'axios';
import { EMAIL_TEMPLATE_MISSING_REQUIRED_TAGS } from '@bsport/common/lib/master-data/error-codes/notification-rule.js';
import CategorySelector from '#src/components/ordering/CategorySelector.component';
import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
import RequiredTags from '#src/components/notification/RequiredTags.component';
import { OptionCallback } from '../../../state/types';
import Checkbox from '../../../components/input/Checkbox.component';
import {
  EmailTemplate,
  EmailTemplateCategory,
  EmailTemplateSummary,
} from '../types';
// @ts-expect-error
import i18n from '../../../i18n';
import { FranchiseCompany } from '../../franchise/types';
import { OptionTypeBase } from '../../../components/Selector/MaterialUISelector.component';
import FranchiseCompaniesSelector from '../../franchise/components/FranchiseCompaniesSelector.component';
import { createUrl } from '../../../utils/createUrlHandlers';

const { trackFormSubmitIntent, trackFormCancel } =
  rudderStackFormTrackingFunctionsRegistry(
    SegmentAnalyticsFormObjectIdentifier.EmailTemplate,
  );
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
    options?: OptionCallback,
  ) => void;
  autoSaveEmail?: (
    id: number,
    data: Omit<EmailTemplate, 'id'>,
    availableCompanies?: number[],
    options?: OptionCallback,
  ) => void;
  displayEmptyError: (msg: string) => void;
  goToList: () => void;
  hideLeftMenuAction: () => void;
  showLeftMenuAction: () => void;
  emailTemplateCategories?: Array<EmailTemplateCategory>;
  requiredTags?: string[];
  relatedNotificationRuleEvents?: number[];
};

type Props = OwnProps & WithStyles<typeof styles> & WithTranslation;

type State = {
  subject: string;
  title: string;
  autoSave: boolean;
  notReadyToLeave: boolean;
  selectedCompanies: OptionTypeBase[];
  categoryId: number;
  openRequiredTagsModal: boolean;
  showAlert: boolean;
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
      dic[company.id] = company;
      return dic;
    }, {});

    this.state = {
      title: props.emailToEdit?.title ?? '',
      subject: props.emailToEdit?.subject ?? '',
      autoSave: this.props.requiredTags
        ? this.props.requiredTags.length === 0
        : true,
      notReadyToLeave: true,
      selectedCompanies: this.props.companies
        ? props.emailToEdit?.available_for_companies?.map((comp) => {
            const _company = this.companyDic?.[comp];
            return {
              value: `${_company?.id}`,
              label: _company?.name,
            };
          })
        : [],
      categoryId: this.props.emailToEdit?.category || null,
      openRequiredTagsModal: false,
      showAlert: false,
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
        // @ts-expect-error
        {
          title: this.state.title,
          subject: this.state.subject,
          html,
          design: JSON.stringify(design),
          date_modified: DateTime.now().toISO(),
          category: this.state.categoryId,
        },
        this.state.selectedCompanies?.map((opt) =>
          // @ts-expect-error
          parseInt(opt?.value ?? '', 10),
        ),
        { onSuccess: this.hideAlertBox, onError: this.showAlertBox },
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
        // @ts-expect-error
        {
          title: this.state.title,
          subject: this.state.subject,
          html,
          design: JSON.stringify(design),
          date_modified: DateTime.now().toISO(),
        },
        this.state.selectedCompanies?.map((opt) =>
          // @ts-expect-error
          parseInt(opt?.value ?? '', 10),
        ),
        { onSuccess: this.hideAlertBox, onError: this.showAlertBox },
      );
    });
  };

  handleTitleChange(title: string) {
    this.setState({ title });
  }

  handleObjectChange(subject: string) {
    this.setState({ subject });
  }

  handleSaveClick = () => {
    trackFormSubmitIntent(this.props.emailToEdit?.id);
    this.setState({ notReadyToLeave: false });
    this.exportHtml();
  };

  handleExportClick = () => {
    const url = createUrl(new Blob([this.props.emailToEdit?.html]));
    const tempEl = document.createElement('a');
    tempEl.href = url;
    tempEl.download = `${this.state.title}.html`;
    tempEl.click();
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.props.tags && !prevProps.tags) {
      // unlayer is the library use under the hood by react-email-editor
      // @ts-expect-error
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
    if (
      prevProps.requiredTags &&
      this.props.requiredTags &&
      !isEqual(this.props.requiredTags, prevProps.requiredTags)
    ) {
      this.setState({ autoSave: false });
    }
  }

  onLoad() {
    // unlayer is the library use under the hood by react-email-editor
    // @ts-expect-error
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

  allCompaniesAllowed = memoize((companies: FranchiseCompany[]) =>
    companies.every((c: FranchiseCompany) => c.isAllowed),
  );

  openModalRequiredTags = () => {
    this.setState({ openRequiredTagsModal: true });
  };

  closeModalRequiredTags = () => {
    this.setState({ openRequiredTagsModal: false });
  };

  showAlertBox = (error: AxiosError) => {
    if (
      error.response?.data.error_code === EMAIL_TEMPLATE_MISSING_REQUIRED_TAGS
    ) {
      this.setState({ showAlert: true });
    }
  };

  hideAlertBox = () => {
    this.setState({ showAlert: false });
  };

  render() {
    const { t, classes } = this.props;
    const mergeTags = this.getMergeTags();
    return (
      <div className={classes.totalEditorContainer}>
        <div className={classes.paper}>
          <Prompt
            message={this.props.t('emailTemplate:leaveAlert')}
            when={this.state.notReadyToLeave}
          />
          <TextField
            required
            className={classes.field}
            inputProps={{ maxLength: 100 }}
            label={t('emailTemplate:editor.title')}
            onChange={(event) => this.handleTitleChange(event.target.value)}
            value={this.state.title}
          />
          <TextField
            required
            className={classes.field}
            inputProps={{ maxLength: 500 }}
            label={t('emailTemplate:editor.subject')}
            onChange={(event) => {
              this.handleObjectChange(event.target.value);
            }}
            value={this.state.subject}
          />
          {this.props.emailTemplateCategories && (
            <CategorySelector
              categories={this.props.emailTemplateCategories}
              onChange={(ev) =>
                // @ts-expect-error
                this.setState({ categoryId: ev?.value || null })
              }
              selected={this.state.categoryId}
            />
          )}
          {this.props?.companies?.length > 0 && (
            <div className={classes.companies}>
              <Typography className={classes.subtitle} variant="body1">
                {t('editor.shareWith')}
              </Typography>
              <div className={classes.selector}>
                <FranchiseCompaniesSelector
                  companies={this.props.companies}
                  companyDic={this.companyDic}
                  onChange={(newValue) => {
                    this.setState({ selectedCompanies: newValue });
                  }}
                  selectedCompanies={this.state.selectedCompanies}
                  unclearable={!this.allCompaniesAllowed(this.props.companies)}
                  withAllCompaniesTag={this.allCompaniesAllowed(
                    this.props.companies,
                  )}
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
          <Button
            className={classes.button}
            onClick={() => {
              this.props.goToList();
              trackFormCancel(this.props.emailToEdit?.id);
            }}
          >
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
              className={classes.button}
              color="primary"
              onClick={this.handleSaveClick}
              variant="contained"
            >
              {t('emailTemplate:editor.save')}
            </Button>
            <Button
              className={classes.button}
              color="primary"
              onClick={this.handleExportClick}
              variant="contained"
            >
              {t('emailTemplate:editor.exportHtml')}
            </Button>
          </div>
        </div>
        {this.props.requiredTags?.length > 0 &&
          this.props.relatedNotificationRuleEvents?.length > 0 &&
          (this.state.showAlert ? (
            <Alert
              classes={{ message: classes.MuiAlertMessage }}
              className={classes.alertBox}
              icon={false}
              severity="error"
            >
              <div className={classes.buttonsContainer}>
                <div className={classes.row}>
                  <div className={classes.column}>
                    <ErrorOutlineIcon className={classes.iconColorRed} />
                  </div>
                  <div className={classes.column}>
                    <Typography>
                      {t('emailTemplate:editor.alertBoxTextFirstLine', {
                        names: this.props.relatedNotificationRuleEvents
                          .map((notification_event) => {
                            return t(
                              `notificationRule:eventType.${notification_event}`,
                            );
                          })
                          .join(', '),
                      })}
                    </Typography>
                    <RequiredTags requiredTagsList={this.props.requiredTags} />
                    <Typography>
                      {t('emailTemplate:editor.infoBoxTextLastLine')}
                    </Typography>
                  </div>
                </div>
              </div>
            </Alert>
          ) : (
            <Alert
              classes={{ message: classes.MuiAlertMessage }}
              className={classes.alertBox}
              icon={false}
              severity="info"
            >
              <div className={classes.buttonsContainer}>
                <div className={classes.row}>
                  <div className={classes.column}>
                    <InfoOutlinedIcon className={classes.iconColorBlue} />
                  </div>
                  <div className={classes.column}>
                    <Typography>
                      {t('emailTemplate:editor.infoBoxTextFirstLine', {
                        names: this.props.relatedNotificationRuleEvents
                          .map((notification_event) => {
                            return t(
                              `notificationRule:eventType.${notification_event}`,
                            );
                          })
                          .join(', '),
                      })}
                    </Typography>
                    <Typography>
                      {t('emailTemplate:editor.infoBoxTextLastLine')}
                    </Typography>
                  </div>
                </div>
                <Button onClick={this.openModalRequiredTags} size="small">
                  {t('emailTemplate:editor.showRequiredTags')}
                </Button>
                <Dialog
                  onClose={this.closeModalRequiredTags}
                  open={this.state.openRequiredTagsModal}
                >
                  <DialogTitle>
                    {t('emailTemplate:editor.dialogWindowTitle')}
                  </DialogTitle>
                  <DialogContent>
                    <RequiredTags requiredTagsList={this.props.requiredTags} />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={this.closeModalRequiredTags} size="small">
                      {t('emailTemplate:editor.closeButton')}
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            </Alert>
          ))}
        <Paper>
          {!!Object.entries(mergeTags).length && (
            <EmailEditor
              ref={this.editor}
              locale={i18n.language}
              minHeight="80vh"
              onLoad={() => this.onLoad()}
              options={{
                // @ts-expect-error
                mergeTags,
                designTags: {
                  business_name: this.props.company_name,
                },
                features: {
                  preview: true,
                },
                version: '1.9.1',
              }}
              translations={{
                'fr-FR': {
                  'labels.merge_tags': 'Ajouter une variable',
                },
                'en-US': {
                  'labels.merge_tags': 'Add a variable',
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
    totalEditorContainer: {
      paddingBottom: 70,
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
    listStyle: {
      margin: 'unset',
      paddingLeft: theme.spacing(3),
      '& li': {
        listStyleType: 'unset',
      },
    },
    iconColorBlue: {
      color: theme.palette.info.main,
    },
    iconColorRed: {
      color: theme.palette.error.main,
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    column: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      paddingRight: '15px',
    },
    MuiAlertMessage: {
      width: '100%',
    },
    alertBox: {
      marginBottom: theme.spacing(2),
    },
  });

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(['emailTemplate', 'notificationRule']),
)(EmailEditorPanel);
