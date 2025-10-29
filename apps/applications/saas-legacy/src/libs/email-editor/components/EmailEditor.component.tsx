import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Prompt } from 'react-router-dom';

// TZ management
import { DateTime } from 'luxon';

// Unlayer
import EmailEditor, {
  type Editor,
  type EditorRef,
  type EmailEditorProps,
} from 'react-email-editor';

// Design System
import Button from '@material-ui/core/Button';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  TextField,
  Paper,
  makeStyles,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

// Types
import type { OptionCallback } from '#src/state/types';
import type {
  EmailTemplate,
  EmailTemplateCategory,
  EmailEditAPIParams,
} from '#src/libs/email-editor/types';
import type { FranchiseCompany } from '#src/libs/franchise/types';
import type { ResolvedTags } from '#src/libs/tag/types';

// Constants
import {
  EMAIL_EDITOR_AUTO_SAVE_INTERVAL,
  EMAIL_EDITOR_MIN_HEIGHT,
  EMAIL_SUBJECT_BACKEND_CHARACTER_LIMIT,
  EMAIL_TITLE_BACKEND_CHARACTER_LIMIT,
} from '#src/libs/email-editor/constants';
import { EMAIL_TEMPLATE_MISSING_REQUIRED_TAGS } from '@bsport/common/lib/master-data/error-codes/notification-rule.js';

// Components
import { createUrl } from '#src/utils/createUrlHandlers';
import Checkbox from '#src/components/input/Checkbox.component';
import CategorySelector from '#src/components/ordering/CategorySelector.component';
import RequiredTags from '#src/components/notification/RequiredTags.component';
import FranchiseCompaniesSelector from '#src/libs/franchise/components/FranchiseCompaniesSelector.component';

// Utils
import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
// @ts-expect-error
import i18n from '#src/i18n';
import Config from '#src/config';

const { trackFormSubmitIntent, trackFormCancel } =
  rudderStackFormTrackingFunctionsRegistry(
    SegmentAnalyticsFormObjectIdentifier.EmailTemplate,
  );

const useStyles = makeStyles((theme) => ({
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
}));

export type SaveEmailsParameters = {
  data: EmailEditAPIParams;
  availableCompanies?: number[];
  id?: number;
  options?: OptionCallback;
};

export type EmailEditorPanelProps = {
  autoSaveEnabled?: boolean;
  companies?: FranchiseCompany[];
  companyName: string;
  companyEmail: string;
  companyId?: number;
  franchiseId?: number;
  emailTemplateCategories?: Array<EmailTemplateCategory>;
  emailToEdit?: EmailTemplate;
  relatedNotificationRuleEvents?: number[];
  requiredTags?: string[];
  tags?: { [tag_name: string]: string[] };
  autoSaveEmail?: (params: SaveEmailsParameters) => void;
  displayEmptyError: (msg: string) => void;
  goToList: () => void;
  hideLeftMenuAction: () => void;
  saveEmail: (params: SaveEmailsParameters) => void;
  showLeftMenuAction: () => void;
  shouldBlockNavigation?: boolean;
};

const EmailEditorPanel: React.FC<EmailEditorPanelProps> = ({
  autoSaveEnabled,
  emailToEdit,
  companyEmail,
  companyId,
  franchiseId,
  companyName,
  tags,
  companies,
  saveEmail,
  autoSaveEmail,
  displayEmptyError,
  goToList,
  hideLeftMenuAction,
  showLeftMenuAction,
  emailTemplateCategories,
  requiredTags = [],
  relatedNotificationRuleEvents = [],
  shouldBlockNavigation,
}) => {
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [title, setTitle] = useState(emailToEdit?.title ?? '');
  const [subject, setSubject] = useState(emailToEdit?.subject ?? '');
  const [autoSave, setAutoSave] = useState(requiredTags.length === 0);
  const [notReadyToLeave, setNotReadyToLeave] = useState(
    shouldBlockNavigation ?? true,
  );
  const companyList = React.useMemo(() => {
    return (
      companies?.reduce<Record<number, FranchiseCompany>>((acc, company) => {
        acc[company.id] = company;
        return acc;
      }, {}) || {}
    );
  }, [companies]);
  const [categoryId, setCategoryId] = useState<number | null>(
    emailToEdit?.category || null,
  );
  const [selectedCompanies, setSelectedCompanies] = useState<
    { label: string; value: string }[]
  >(
    companies
      ? emailToEdit?.available_for_companies?.map((comp) => {
          const _company = companyList?.[comp];
          return {
            value: `${_company?.id}`,
            label: _company?.name,
          };
        }) || []
      : [],
  );
  const [openRequiredTagsModal, setOpenRequiredTagsModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const classes = useStyles();
  const { t } = useTranslation(['emailTemplate', 'notificationRule']);
  const emailEditorRef = useRef<EditorRef>(null);

  const allCompaniesAllowed = React.useMemo(
    () => companies?.every((c: FranchiseCompany) => c.isAllowed) || false,
    [companies],
  );

  const getMergeTags = React.useMemo(() => {
    if (!tags) return null;

    const mergedTags: ResolvedTags = Object.entries(tags).reduce(
      (acc, [tagCategory, tagList]) => ({
        ...acc,
        [tagCategory]: {
          name: t(`notificationRule:tag.${tagCategory}.name`),
          mergeTags: tagList.reduce(
            (tagListAcc, tag) => ({
              ...tagListAcc,
              [tag]: {
                name: t(`notificationRule:tag.${tagCategory}.tags.${tag}`),
                value: `{${tag}}`,
              },
            }),
            {},
          ),
        },
      }),
      {},
    );

    return mergedTags;
  }, [tags, t]);

  const handleSaveClick = () => {
    trackFormSubmitIntent(emailToEdit?.id);
    setNotReadyToLeave(false);
    saveHtml({ saveFunction: saveEmail });
  };

  const getError = useCallback(
    (design): string | null => {
      if (!title) {
        return 'emailTemplate:editor.error.title';
      } else if (!subject) {
        return 'emailTemplate:editor.error.subject';
      } else if (!design || Object.keys(design?.counters || {}).length === 2) {
        return 'emailTemplate:editor.error.content';
      }
      return null;
    },
    [title, subject],
  );

  const handleExportClick = useCallback(() => {
    if (!emailEditorRef.current) return;
    emailEditorRef.current?.editor?.exportHtml(({ html }) => {
      const url = createUrl(new Blob([html]));
      if (!url) return;

      const tempEl = document.createElement('a');
      tempEl.href = url;
      tempEl.download = `${title}.html`;
      tempEl.click();
    });
  }, [title]);

  const handleSaveError = useCallback((error: any) => {
    if (
      error?.response?.data.error_code === EMAIL_TEMPLATE_MISSING_REQUIRED_TAGS
    ) {
      setShowAlert(true);
    }
  }, []);

  const saveHtml = useCallback(
    ({
      saveFunction,
    }: {
      saveFunction: (params: SaveEmailsParameters) => void;
    }) => {
      if (!emailEditorRef.current || !saveFunction) return;
      emailEditorRef.current?.editor?.exportHtml(({ design, html }) => {
        const errorMessage = getError(design);
        if (errorMessage) {
          displayEmptyError(t(errorMessage));
          return;
        }

        const categoryValue =
          categoryId !== null && categoryId !== undefined ? categoryId : null;

        const emailData: EmailEditAPIParams = {
          title,
          subject,
          html,
          design: JSON.stringify(design),
          date_modified: DateTime.now().toISO(),
          category: categoryValue,
        };

        const availableCompaniesIds: number[] = (selectedCompanies || [])
          .map((company) => parseInt(company?.value, 10))
          .filter(
            (_companyId) => !isNaN(_companyId) && Number.isInteger(_companyId),
          );

        saveFunction({
          id: emailToEdit?.id,
          data: emailData,
          availableCompanies: availableCompaniesIds,
          options: {
            onSuccess: () => setShowAlert(false),
            onError: handleSaveError,
          },
        });
      });
    },
    [
      emailEditorRef,
      getError,
      displayEmptyError,
      t,
      categoryId,
      title,
      subject,
      emailToEdit,
      selectedCompanies,
      handleSaveError,
    ],
  );

  const getProductionUnlayerUser = useCallback(
    (userId: string) => {
      const hasRequiredFields = companyEmail && companyName;

      if (!hasRequiredFields) {
        return undefined;
      }

      return {
        id: userId,
        email: companyEmail,
        name: companyName,
      };
    },
    [companyEmail, companyName],
  );

  const getDevelopmentUnlayerUser = useCallback(() => {
    const currentEnv = Config.REACT_APP_SENTRY_ENVIRONMENT;
    const companyType = franchiseId
      ? 'franchise'
      : companyId
      ? 'company'
      : 'no-type';
    const isStudioIdOdd =
      (companyId ?? franchiseId ?? 1) % 2 === 0 ? 'odd' : 'not-odd';
    const testId = `${currentEnv}-${companyType}-test-${isStudioIdOdd}`;

    return {
      id: testId,
      email: `${currentEnv}.${companyType}.${isStudioIdOdd}@bsport.io`,
      name: `${currentEnv}-${companyType} ${isStudioIdOdd}`,
    };
  }, [companyId, franchiseId]);

  const getUnlayerUser = useCallback(() => {
    const unlayerUserId = franchiseId
      ? `franchise-${franchiseId}`
      : companyId
      ? `company-${companyId}`
      : null;

    if (!unlayerUserId) {
      return undefined;
    }

    const isProduction = Config.REACT_APP_SENTRY_ENVIRONMENT === 'production';

    if (isProduction) {
      return getProductionUnlayerUser(unlayerUserId);
    }

    return getDevelopmentUnlayerUser();
  }, [
    companyId,
    franchiseId,
    getProductionUnlayerUser,
    getDevelopmentUnlayerUser,
  ]);

  const handleUpdateAutoSave = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setAutoSave(ev.target.checked);
  };

  const handleChangeCategory = (newCategory: {
    label: string;
    value: string;
  }) => {
    const newCategoryId = parseInt(newCategory?.value, 10) ?? null;
    setCategoryId(newCategoryId);
  };

  const handleUpdateCompanies = (
    newCompanies: { label: string; value: string }[],
  ) => {
    if (newCompanies) {
      setSelectedCompanies(newCompanies);
    }
  };

  const onCancelEmailEditing = () => {
    goToList();
    trackFormCancel(emailToEdit?.id);
  };

  const getRelatedNotificationRuleEventsNames = useCallback(() => {
    return relatedNotificationRuleEvents
      .map((notificationEvent) => {
        return t(`notificationRule:eventType.${notificationEvent}`);
      })
      .join(', ');
  }, [relatedNotificationRuleEvents, t]);

  const handleOpenRequiredTagModal = () => {
    setOpenRequiredTagsModal(true);
  };

  const handleCloseRequiredTagModal = () => {
    setOpenRequiredTagsModal(false);
  };

  const handleChangeEmailTitle = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTitle(event.target.value);
  };

  const handleChangeEmailSubject = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSubject(event.target.value);
  };

  const onReady: EmailEditorProps['onReady'] = (unlayer: Editor) => {
    unlayer?.loadDesign(emailToEdit?.design);
  };

  useEffect(
    () => {
      hideLeftMenuAction();

      return () => {
        showLeftMenuAction();
        if (intervalId) {
          clearInterval(intervalId);
        }
      };
    },
    // We want to run this effect only once when the component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(
    () => {
      if (autoSave) {
        const interval = setInterval(() => {
          if (!!autoSaveEmail && typeof autoSaveEmail === 'function') {
            saveHtml({ saveFunction: autoSaveEmail });
          }
        }, EMAIL_EDITOR_AUTO_SAVE_INTERVAL);

        setIntervalId(interval);

        return () => {
          clearInterval(interval);
          setIntervalId(null);
        };
      }

      if (intervalId && !autoSave) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [saveHtml, autoSave, autoSaveEmail],
  );

  useEffect(() => {
    if (requiredTags && requiredTags.length > 0) {
      setAutoSave(false);
    }
  }, [requiredTags]);

  const mergeTags: ResolvedTags = getMergeTags || {};

  const currentLocale = i18n.language || 'en-US';

  const unlayerProjectId = parseInt(Config.REACT_APP_UNLAYER_PROJECT_ID || '');

  const unlayerUser = getUnlayerUser();

  return (
    <div className={classes.totalEditorContainer}>
      <div className={classes.paper}>
        <Prompt
          message={t('emailTemplate:leaveAlert')}
          when={notReadyToLeave}
        />
        <TextField
          required
          className={classes.field}
          inputProps={{ maxLength: EMAIL_TITLE_BACKEND_CHARACTER_LIMIT }}
          label={t('emailTemplate:editor.title')}
          onChange={handleChangeEmailTitle}
          value={title}
        />
        <TextField
          required
          className={classes.field}
          inputProps={{ maxLength: EMAIL_SUBJECT_BACKEND_CHARACTER_LIMIT }}
          label={t('emailTemplate:editor.subject')}
          onChange={handleChangeEmailSubject}
          value={subject}
        />
        {emailTemplateCategories && (
          <CategorySelector
            categories={emailTemplateCategories}
            onChange={handleChangeCategory}
            selected={categoryId}
          />
        )}
        {!!companies && companies.length > 0 && (
          <div className={classes.companies}>
            <Typography className={classes.subtitle} variant="body1">
              {t('editor.shareWith')}
            </Typography>
            <div className={classes.selector}>
              <FranchiseCompaniesSelector
                companies={companies}
                companyDic={companyList}
                onChange={handleUpdateCompanies}
                selectedCompanies={selectedCompanies}
                unclearable={!allCompaniesAllowed}
                withAllCompaniesTag={allCompaniesAllowed}
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
        <Button className={classes.button} onClick={onCancelEmailEditing}>
          {t('emailTemplate:editor.cancel')}
        </Button>
        <div className={classes.rightContainer}>
          {autoSaveEnabled ? (
            <Checkbox
              checked={autoSave}
              label={t('emailTemplate:autoSave')}
              onChange={handleUpdateAutoSave}
            />
          ) : null}
          <Button
            className={classes.button}
            color="primary"
            onClick={handleSaveClick}
            variant="contained"
          >
            {t('emailTemplate:editor.save')}
          </Button>
          <Button
            className={classes.button}
            color="primary"
            onClick={handleExportClick}
            variant="contained"
          >
            {t('emailTemplate:editor.exportHtml')}
          </Button>
        </div>
      </div>
      {requiredTags?.length > 0 &&
        relatedNotificationRuleEvents?.length > 0 &&
        (showAlert ? (
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
                      names: getRelatedNotificationRuleEventsNames(),
                    })}
                  </Typography>
                  <RequiredTags requiredTagsList={requiredTags} />
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
                      names: getRelatedNotificationRuleEventsNames(),
                    })}
                  </Typography>
                  <Typography>
                    {t('emailTemplate:editor.infoBoxTextLastLine')}
                  </Typography>
                </div>
              </div>
              <Button onClick={handleOpenRequiredTagModal} size="small">
                {t('emailTemplate:editor.showRequiredTags')}
              </Button>
              <Dialog
                onClose={handleCloseRequiredTagModal}
                open={openRequiredTagsModal}
              >
                <DialogTitle>
                  {t('emailTemplate:editor.dialogWindowTitle')}
                </DialogTitle>
                <DialogContent>
                  <RequiredTags requiredTagsList={requiredTags} />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseRequiredTagModal} size="small">
                    {t('emailTemplate:editor.closeButton')}
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </Alert>
        ))}
      <Paper>
        {!!mergeTags && (
          <EmailEditor
            ref={emailEditorRef}
            minHeight={EMAIL_EDITOR_MIN_HEIGHT}
            onReady={onReady}
            options={{
              mergeTags: mergeTags,
              features: {
                preview: true,
              },
              designTags: {
                bussiness_name: companyName || '',
              },
              locale: currentLocale,
              translations: {
                'fr-FR': {
                  'labels.merge_tags': 'Ajouter une variable',
                },
                'en-US': {
                  'labels.merge_tags': 'Add a variable',
                },
              },
              projectId: unlayerProjectId,
              user: unlayerUser,
            }}
          />
        )}
      </Paper>
    </div>
  );
};

export default EmailEditorPanel;
