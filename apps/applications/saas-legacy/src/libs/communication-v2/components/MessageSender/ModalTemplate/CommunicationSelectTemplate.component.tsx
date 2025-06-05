import React, { useCallback, useEffect, useState } from 'react';
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
import type { EmailTemplateDetail } from '#src/libs/email-editor/types';
import { openNewBackOfficeWindow } from '#src/utils/windows';
import { useTagsAndCategories } from '#src/libs/communication-v2/hooks/useCommunicationsTools.hooks';
import {
  FetchTemplateDetailsParams,
  useEmailTemplates,
} from '#src/libs/communication-v2/hooks/useEmailTemplates.hooks';

export type Props = {
  currentTitle: string;
  emailDetailList: Record<number, EmailTemplateDetail>;
  selectedTemplate: number;
  elementContext: 'dialog' | 'body';
  fetchEmailSummaryList: () => void;
  updateCurrentTitle: (title: string) => void;
  updateSelectedTemplate: (templateId: number) => void;
};

const CommunicationSelectTemplate: React.FC<Props> = ({
  currentTitle,
  emailDetailList,
  selectedTemplate,
  elementContext,
  fetchEmailSummaryList,
  updateCurrentTitle,
  updateSelectedTemplate,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('communication');

  const [displayTemplatePreview, setDisplayTemplatePreview] = useState(false);
  const [displayRefreshAlert, setDisplayRefreshAlert] = useState(false);
  const {
    templateSummaryList,
    loadingTemplateDetails,
    loadingTemplateSummaries,
    fetchTemplateDetails,
  } = useEmailTemplates();
  const { resolvedGenericTags } = useTagsAndCategories();

  const onChangeTemplate = useCallback(
    (templateId: number) => {
      updateSelectedTemplate(templateId);
      updateCurrentTitle(
        templateId
          ? templateSummaryList.find((email) => email.id === templateId).subject
          : '',
      );
    },
    [templateSummaryList, updateCurrentTitle, updateSelectedTemplate],
  );

  const onSelectTemplate = useCallback(
    (eventValue: number) => {
      if (eventValue) {
        const params: FetchTemplateDetailsParams = {
          templateId: eventValue,
        };
        onChangeTemplate(eventValue);
        fetchTemplateDetails(params);
      } else {
        onChangeTemplate(null);
      }
    },
    [fetchTemplateDetails, onChangeTemplate],
  );

  const onTitleChange = useCallback(
    (e: React.ChangeEvent) => {
      const target = e.target as HTMLInputElement;
      updateCurrentTitle(target.value);
    },
    [updateCurrentTitle],
  );

  const onCreateClick = useCallback(() => {
    setDisplayRefreshAlert(true);
    const url = '/email-template/create';
    openNewBackOfficeWindow(url);
  }, []);

  const onEditClick = useCallback(() => {
    setDisplayRefreshAlert(true);
    const url = `/email-template/${selectedTemplate}/edit`;
    openNewBackOfficeWindow(url);
  }, [selectedTemplate]);

  const onRefreshClick = useCallback(() => {
    const params: FetchTemplateDetailsParams = {
      templateId: selectedTemplate,
    };
    fetchEmailSummaryList();
    fetchTemplateDetails(params);
    setDisplayRefreshAlert(false);
  }, [fetchEmailSummaryList, fetchTemplateDetails, selectedTemplate]);

  const onShowTemplateClick = useCallback(
    () => setDisplayTemplatePreview((prevState) => !prevState),
    [],
  );

  useEffect(() => {
    if (selectedTemplate && !loadingTemplateDetails) {
      setDisplayTemplatePreview(true);
    }
  }, [selectedTemplate, loadingTemplateDetails]);

  const html =
    !loadingTemplateDetails && emailDetailList?.[selectedTemplate]?.html;

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
      {loadingTemplateSummaries ? (
        <LinearProgress className={classes.selectorContainer} />
      ) : (
        <div className={classes.selectorContainer}>
          <div className={classes.emailSelectorContainer}>
            <EmailSelector
              attachSelectorToBody={elementContext === 'body'}
              emails={templateSummaryList}
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
          {selectedTemplate && !loadingTemplateDetails ? (
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
            {selectedTemplate && !loadingTemplateDetails && !!html ? (
              <HTMLPreview
                scrolling
                html={html}
                resolvedGenericTags={resolvedGenericTags}
              />
            ) : (
              <>
                {loadingTemplateDetails && !!html ? (
                  <CircularProgress />
                ) : (
                  <div className={classes.previewEmpty}>
                    <Alert className={classes.alertInfo} severity="info">
                      {templateSummaryList?.length > 0
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
