import React, { PureComponent } from 'react';
import { withStyles, Theme, WithStyles } from '@material-ui/core';
import { withTranslation, WithTranslation } from 'react-i18next';
import { compose } from 'recompose';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Collapse from '@material-ui/core/Collapse';
import Fab from '@material-ui/core/Fab';
import LinearProgress from '@material-ui/core/LinearProgress';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert/Alert';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@material-ui/icons';

import EmailSelector from '#libs/email-editor/components/EmailSelector.component';
import CommunicationWrapperDialog from '../../CommunicationWrapperDialog.component';
import HTMLPreview from '#components/html/HTMLPreview.component';
import {
  EmailTemplateDetail,
  ResolvedGenericTags,
} from '#libs/email-editor/types';

type OwnProps = {
  closeDialog: () => void;
  emailSummaryListLoading: boolean;
  emailSummaryList: Array<any>;
  emailDetailListLoading: boolean;
  emailDetailList: Record<number, EmailTemplateDetail>;
  fetchEmailSummaryList: () => void;
  fullScreen?: boolean;
  getEmailDetail: (id: number) => void;
  open: boolean;
  selectedTemplate: number;
  selectedTitle: string;
  setTemplate: (id: number) => void;
  setTitle: (title: string) => void;
  resolvedGenericTags: ResolvedGenericTags;
};

export type Props = OwnProps & WithTranslation & WithStyles;

type State = {
  displayTemplatePreview: boolean;
  displayRefreshAlert: boolean;
  selectedTemplate: number;
  currentTitle: string;
};

export class CommunicationTemplateModal extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      displayTemplatePreview: false,
      displayRefreshAlert: false,
      selectedTemplate: props.selectedTemplate,
      currentTitle: props.selectedTitle ?? '',
    };
  }

  componentDidMount(): void {
    if (!this.props.emailSummaryList?.length) {
      this.props.fetchEmailSummaryList();
    }
  }

  onChangeTemplate = (templateId: number) => {
    this.setState({
      selectedTemplate: templateId,
      currentTitle: templateId
        ? this.props.emailSummaryList.find((email) => email.id === templateId)
            .subject
        : '',
    });
  };

  onCloseDialog = () => {
    this.setState(
      {
        displayTemplatePreview: false,
        displayRefreshAlert: false,
      },
      this.props.closeDialog,
    );
  };

  onEditClick = () => {
    this.setState({ displayRefreshAlert: true });
    const url = `/email-template/${this.state.selectedTemplate}/edit`;
    const win = window.open(url);
    win.focus();
  };

  onCreateClick = () => {
    this.setState({ displayRefreshAlert: true });
    const url = '/email-template/create';
    const win = window.open(url);
    win.focus();
  };

  onTitleChange = (e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    this.setState({ currentTitle: target.value });
  };

  onSelectTemplate = (ev: any) => {
    if (ev) {
      this.onChangeTemplate(ev.value);
      this.props.getEmailDetail(ev.value);
    } else {
      this.onChangeTemplate(null);
    }
  };

  onShowTemplateClick = () =>
    this.setState((prevState) => ({
      displayTemplatePreview: !prevState.displayTemplatePreview,
    }));

  onRefreshClick = () => {
    this.props.fetchEmailSummaryList();
    this.props.getEmailDetail(this.state.selectedTemplate);
    this.setState({ displayRefreshAlert: false });
  };

  onConfirm = () => {
    this.props.setTemplate(this.state.selectedTemplate);
    this.props.setTitle(this.state.currentTitle);
    this.onCloseDialog();
  };

  renderLoadingOrEmpty = (loading: boolean, emails: Array<any>) => {
    const { t, classes } = this.props;
    if (loading) {
      return <CircularProgress />;
    }
    return (
      <div className={classes.previewEmpty}>
        <Alert severity="info" className={classes.alertInfo}>
          {emails?.length > 0
            ? t('mail.selectToShowPreview')
            : t('mail.noMailAvailable')}
        </Alert>
      </div>
    );
  };

  renderContent = () => {
    const { t, classes } = this.props;
    const html =
      !this.props.emailDetailListLoading &&
      this.props.emailDetailList?.[this.state.selectedTemplate]?.html;
    return (
      <div className={classes.contentContainer}>
        <TextField
          name="Mail title"
          placeholder={t('mail.title')}
          fullWidth
          required
          className={classes.mailTitle}
          value={this.state.currentTitle}
          onChange={this.onTitleChange}
        />
        {this.props.emailSummaryListLoading ? (
          <LinearProgress className={classes.selectorContainer} />
        ) : (
          <div className={classes.selectorContainer}>
            <EmailSelector
              emails={this.props.emailSummaryList}
              value={this.state.selectedTemplate}
              onChange={this.onSelectTemplate}
              helperText={t('mail.mailSelection')}
            />
            <Fab
              onClick={this.onCreateClick}
              size="small"
              color="secondary"
              className={classes.addIcon}
            >
              <AddIcon />
            </Fab>
          </div>
        )}
        <div className={classes.container}>
          {this.state.displayRefreshAlert && (
            <div className={classes.refreshContainer}>
              <Button
                onClick={this.onRefreshClick}
                color="secondary"
                variant="outlined"
              >
                <RefreshIcon className={classes.icon} color="secondary" />
                <Typography variant="caption" color="secondary">
                  {t('common.refresh')}
                </Typography>
              </Button>
              <div className={classes.refreshText}>
                <Alert severity="info" className={classes.alertInfo}>
                  {t('dialogTemplate.refreshText')}
                </Alert>
              </div>
            </div>
          )}
          <div className={classes.buttonContainer}>
            <Button onClick={this.onShowTemplateClick}>
              {this.state.displayTemplatePreview ? (
                <div className={classes.inlineContainer}>
                  <VisibilityOffIcon className={classes.icon} />
                  <Typography variant="caption">
                    {t('mail.hideMail')}
                  </Typography>
                </div>
              ) : (
                <div className={classes.inlineContainer}>
                  <VisibilityIcon className={classes.icon} />
                  <Typography variant="caption">
                    {t('mail.showMail')}
                  </Typography>
                </div>
              )}
            </Button>
          </div>
          <Collapse
            in={this.state.displayTemplatePreview}
            className={classes.collapse}
          >
            {this.state.selectedTemplate &&
            !this.props.emailDetailListLoading ? (
              <div className={classes.editIcon}>
                <Fab
                  onClick={this.onEditClick}
                  color="secondary"
                  size="small"
                  disabled={this.state.selectedTemplate === null}
                  classes={{ disabled: classes.disabled }}
                  className={classes.advancedIndex}
                >
                  <EditIcon />
                </Fab>
              </div>
            ) : null}
            <div className={classes.mailPreview}>
              {this.state.selectedTemplate &&
              !this.props.emailDetailListLoading &&
              !!html ? (
                <HTMLPreview
                  html={html}
                  scrolling
                  resolvedGenericTags={this.props.resolvedGenericTags}
                />
              ) : (
                this.renderLoadingOrEmpty(
                  this.props.emailDetailListLoading && !!html,
                  this.props.emailSummaryList,
                )
              )}
            </div>
          </Collapse>
        </div>
      </div>
    );
  };

  render() {
    const { open, fullScreen, t } = this.props;
    return (
      <CommunicationWrapperDialog
        title={t('dialogTemplate.title')}
        buttonCancelText={t('common.cancel')}
        buttonConfirmText={t('common.confirm')}
        onCancel={this.onCloseDialog}
        onConfirm={this.onConfirm}
        open={open}
        fullScreen={fullScreen}
        closeDialog={this.onCloseDialog}
      >
        {this.renderContent()}
      </CommunicationWrapperDialog>
    );
  }
}

const styles: any = (theme: Theme) => ({
  alertInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  addIcon: {
    marginLeft: theme.spacing(1),
  },
  advancedIndex: {
    zIndex: 10,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  collapse: {
    width: '100%',
  },
  container: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  contentContainer: {
    width: '100%',
  },
  editIcon: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(-2),
    marginRight: theme.spacing(-2),
    zIndex: 100,
  },
  flexRowContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  inlineContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  mailPreview: {
    border: '1px solid grey',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '30vh',
    width: '100%',
  },
  mailTitle: {
    marginBottom: theme.spacing(2),
  },
  previewEmpty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: theme.spacing(6),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  refreshContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  refreshText: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  selectorContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
  },
});

export default compose<any, OwnProps>(
  withTranslation(['communication']),
  withStyles(styles),
)(CommunicationTemplateModal);
