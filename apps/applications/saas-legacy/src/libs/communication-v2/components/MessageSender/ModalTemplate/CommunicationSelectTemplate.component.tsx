import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';

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

import EmailSelector from '#src/libs/email-editor/components/EmailSelector.component';
import HTMLPreview from '#src/components/html/HTMLPreview.component';
import type {
  EmailTemplateDetail,
  EmailTemplateSummary,
  ResolvedGenericTags,
} from '#src/libs/email-editor/types';
import { openNewBackOfficeWindow } from '#src/utils/windows';

export type Props = {
  currentTitle: string;
  emailDetailList: Record<number, EmailTemplateDetail>;
  emailDetailListLoading: boolean;
  emailSummaryList: EmailTemplateSummary[];
  emailSummaryListLoading: boolean;
  resolvedGenericTags: ResolvedGenericTags;
  selectedTemplate: number;
  fetchEmailSummaryList: () => void;
  getEmailDetail: (id: number) => void;
  updateCurrentTitle: (title: string) => void;
  updateSelectedTemplate: (templateId: number) => void;
};

const CommunicationSelectTemplate: React.FC<Props> = ({
  currentTitle,
  emailDetailList,
  emailDetailListLoading,
  emailSummaryList,
  emailSummaryListLoading,
  resolvedGenericTags,
  selectedTemplate,
  fetchEmailSummaryList,
  getEmailDetail,
  updateCurrentTitle,
  updateSelectedTemplate,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('communication');

  const [displayTemplatePreview, setDisplayTemplatePreview] =
    React.useState(false);
  const [displayRefreshAlert, setDisplayRefreshAlert] = React.useState(false);

  const onChangeTemplate = React.useCallback(
    (templateId: number) => {
      updateSelectedTemplate(templateId);
      updateCurrentTitle(
        templateId
          ? emailSummaryList.find((email) => email.id === templateId).subject
          : '',
      );
    },
    [emailSummaryList, updateCurrentTitle, updateSelectedTemplate],
  );

  const onSelectTemplate = React.useCallback(
    (eventValue: number) => {
      if (eventValue) {
        onChangeTemplate(eventValue);
        getEmailDetail(eventValue);
      } else {
        onChangeTemplate(null);
      }
    },
    [getEmailDetail, onChangeTemplate],
  );

  const onTitleChange = React.useCallback(
    (e: React.ChangeEvent) => {
      const target = e.target as HTMLInputElement;
      updateCurrentTitle(target.value);
    },
    [updateCurrentTitle],
  );

  const onCreateClick = React.useCallback(() => {
    setDisplayRefreshAlert(true);
    const url = '/email-template/create';
    openNewBackOfficeWindow(url);
  }, []);

  const onEditClick = React.useCallback(() => {
    setDisplayRefreshAlert(true);
    const url = `/email-template/${selectedTemplate}/edit`;
    openNewBackOfficeWindow(url);
  }, [selectedTemplate]);

  const onRefreshClick = React.useCallback(() => {
    fetchEmailSummaryList();
    getEmailDetail(selectedTemplate);
    setDisplayRefreshAlert(false);
  }, [fetchEmailSummaryList, getEmailDetail, selectedTemplate]);

  const onShowTemplateClick = React.useCallback(
    () => setDisplayTemplatePreview((prevState) => !prevState),
    [],
  );

  const html =
    !emailDetailListLoading && emailDetailList?.[selectedTemplate]?.html;

  React.useEffect(() => {
    if (selectedTemplate) {
      getEmailDetail(selectedTemplate);
    }
  }, [getEmailDetail, selectedTemplate]);

  return (
    <div className={classes.contentContainer}>
      <TextField
        fullWidth
        required
        className={classes.mailTitle}
        name="Mail title"
        onChange={onTitleChange}
        placeholder={t('mail.title')}
        value={currentTitle}
      />
      {emailSummaryListLoading ? (
        <LinearProgress className={classes.selectorContainer} />
      ) : (
        <div className={classes.selectorContainer}>
          <div className={classes.emailSelectorContainer}>
            <EmailSelector
              emails={emailSummaryList}
              helperText={t('mail.mailSelection')}
              onChange={onSelectTemplate}
              value={selectedTemplate}
            />
          </div>
          <Fab
            className={classes.addIcon}
            color="secondary"
            onClick={onCreateClick}
            size="small"
          >
            <AddIcon />
          </Fab>
        </div>
      )}
      <div className={classes.container}>
        {displayRefreshAlert && (
          <div className={classes.refreshContainer}>
            <Button
              color="secondary"
              onClick={onRefreshClick}
              variant="outlined"
            >
              <RefreshIcon className={classes.icon} color="secondary" />
              <Typography color="secondary" variant="caption">
                {t('common.refresh')}
              </Typography>
            </Button>
            <div className={classes.refreshText}>
              <Alert className={classes.alertInfo} severity="info">
                {t('dialogTemplate.refreshText')}
              </Alert>
            </div>
          </div>
        )}
        <div className={classes.buttonContainer}>
          <Button onClick={onShowTemplateClick}>
            {displayTemplatePreview ? (
              <div className={classes.inlineContainer}>
                <VisibilityOffIcon className={classes.icon} />
                <Typography variant="caption">{t('mail.hideMail')}</Typography>
              </div>
            ) : (
              <div className={classes.inlineContainer}>
                <VisibilityIcon className={classes.icon} />
                <Typography variant="caption">{t('mail.showMail')}</Typography>
              </div>
            )}
          </Button>
        </div>
        <Collapse className={classes.collapse} in={displayTemplatePreview}>
          {selectedTemplate && !emailDetailListLoading ? (
            <div className={classes.editIcon}>
              <Fab
                className={classes.advancedIndex}
                color="secondary"
                disabled={selectedTemplate === null}
                onClick={onEditClick}
                size="small"
              >
                <EditIcon />
              </Fab>
            </div>
          ) : null}
          <div className={classes.mailPreview}>
            {selectedTemplate && !emailDetailListLoading && !!html ? (
              <HTMLPreview
                scrolling
                html={html}
                resolvedGenericTags={resolvedGenericTags}
              />
            ) : (
              <>
                {emailDetailListLoading && !!html ? (
                  <CircularProgress />
                ) : (
                  <div className={classes.previewEmpty}>
                    <Alert className={classes.alertInfo} severity="info">
                      {emailSummaryList?.length > 0
                        ? t('mail.selectToShowPreview')
                        : t('mail.noMailAvailable')}
                    </Alert>
                  </div>
                )}
              </>
            )}
          </div>
        </Collapse>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
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
  emailSelectorContainer: {
    width: '85%',
  },
}));

export default React.memo(CommunicationSelectTemplate);
