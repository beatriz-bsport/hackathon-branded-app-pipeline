import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles, Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
} from '@material-ui/icons';

import TextFieldWithChildren from '#src/components/input/text-field/TextFieldWithChildren';
import type { EmailTemplateDetail } from '#src/libs/email-editor/types';
import type { FetchTemplateDetailsParams } from '#src/libs/communication-v2/hooks/useEmailTemplates.hooks';
import HTMLPreview from '#src/components/html/HTMLPreview.component';

import {
  TEXTFIELD_MAIL_TITLE,
  TEXTFIELD_MAIL_CONTENT,
} from '#src/libs/communication-v2/constants';
import CommunicationWrapperDialog from '../../CommunicationWrapperDialog.component';
import { useTagsAndCategories } from '#src/libs/communication-v2/hooks/useCommunicationsTools.hooks';

type Props = {
  children: React.ReactNode;
  emailContent: string;
  emailTemplateDetails?: Record<number, EmailTemplateDetail>;
  emailTemplateSelected?: number;
  emailTitle: string;
  handleChangeContent: (event: React.ChangeEvent) => void;
  handleChangeTitle: (event: React.ChangeEvent) => void;
  isMobileSize?: boolean;
  loadingTemplateDetails?: boolean;
  onEditTemplate?: () => void;
  onFocus?: (identifier: number) => void;
  onSeeTemplate?: () => void;
  onRemoveTemplate?: () => void;
  refreshTemplateData?: ({ templateId }: FetchTemplateDetailsParams) => void;
};

const CommunicationWriteEmail: React.FC<Props> = ({
  children,
  handleChangeContent,
  handleChangeTitle,
  emailContent,
  emailTemplateDetails,
  emailTemplateSelected,
  emailTitle,
  isMobileSize,
  loadingTemplateDetails,
  onFocus,
  onRemoveTemplate,
  onEditTemplate,
  onSeeTemplate,
  refreshTemplateData,
}) => {
  const { t } = useTranslation('communication');

  const [showRefreshDialog, setShowRefreshDialog] = useState(false);

  const onTitleFocus = useCallback(
    () => onFocus?.(TEXTFIELD_MAIL_TITLE),
    [onFocus],
  );

  const onContentFocus = useCallback(
    () => onFocus?.(TEXTFIELD_MAIL_CONTENT),
    [onFocus],
  );

  const onRefreshTemplateData = useCallback(() => {
    const refreshTemplateDaraParams: FetchTemplateDetailsParams = {
      templateId: emailTemplateSelected,
    };
    setShowRefreshDialog(false);
    refreshTemplateData(refreshTemplateDaraParams);
  }, [emailTemplateSelected, refreshTemplateData]);

  const handleEditTemplate = useCallback(() => {
    onEditTemplate();
    setShowRefreshDialog(true);
  }, [onEditTemplate]);

  return (
    <React.Fragment>
      <TextFieldWithChildren
        changeValue={handleChangeTitle}
        customOptions={{
          margin: { bottom: true },
          rows: { minRows: 1 },
          focus: { onFocus: onTitleFocus },
        }}
        name="Mail title"
        placeholder={t('sendMessage.textField.object')}
        value={emailTitle}
      />
      {emailTemplateSelected ? (
        <EmailPreview
          emailTemplateDetails={emailTemplateDetails}
          emailTemplateSelected={emailTemplateSelected}
          loadingTemplateDetails={loadingTemplateDetails}
          onEditTemplate={handleEditTemplate}
          onRemoveTemplate={onRemoveTemplate}
          onSeeTemplate={onSeeTemplate}
        >
          {children}
        </EmailPreview>
      ) : (
        <TextFieldWithChildren
          changeValue={handleChangeContent}
          customOptions={{
            display: { column: true },
            rows: {
              minRows: isMobileSize ? 2 : 6,
            },
            focus: {
              onFocus: onContentFocus,
            },
          }}
          name="Mail content"
          placeholder={t('sendMessage.textField.content')}
          value={emailContent}
        >
          {children}
        </TextFieldWithChildren>
      )}
      {showRefreshDialog && (
        <RefreshDialog
          openDialog={showRefreshDialog}
          refreshTemplateData={onRefreshTemplateData}
        />
      )}
    </React.Fragment>
  );
};

type PreviewProps = {
  children: React.ReactNode;
  emailTemplateDetails: Record<number, EmailTemplateDetail>;
  emailTemplateSelected: number;
  loadingTemplateDetails: boolean;
  onSeeTemplate: () => void;
  onEditTemplate: () => void;
  onRemoveTemplate: () => void;
};

const EmailPreview: React.FC<PreviewProps> = React.memo(
  ({
    children,
    emailTemplateSelected,
    emailTemplateDetails,
    loadingTemplateDetails,
    onSeeTemplate,
    onEditTemplate,
    onRemoveTemplate,
  }) => {
    const { resolvedGenericTags } = useTagsAndCategories();
    const classes = useStyles();

    return (
      <div className={classes.mailPreviewContainer}>
        <div className={classes.mailPreviewSubcontainer}>
          <div className={classes.mailPreviewButtonsContainer}>
            <IconButton onClick={onSeeTemplate} size="small">
              <VisibilityIcon />
            </IconButton>
            <IconButton onClick={onEditTemplate} size="small">
              <EditIcon />
            </IconButton>
            <IconButton onClick={onRemoveTemplate} size="small">
              <CloseIcon />
            </IconButton>
          </div>
          <div className={classes.mailPreviewContent}>
            {!loadingTemplateDetails ? (
              <HTMLPreview
                html={emailTemplateDetails[emailTemplateSelected]?.html}
                resolvedGenericTags={resolvedGenericTags}
              />
            ) : (
              <CircularProgress />
            )}
          </div>
          <span />
        </div>
        {children}
      </div>
    );
  },
);

type RefreshProps = {
  openDialog: boolean;
  refreshTemplateData: () => void;
};

const RefreshDialog: React.FC<RefreshProps> = React.memo(
  ({ openDialog, refreshTemplateData }) => {
    const { t } = useTranslation('communication');

    return (
      <CommunicationWrapperDialog
        buttonCancelText={t('common.cancel')}
        buttonConfirmText={t('common.refresh')}
        fullScreen={false}
        maxWidth="xs"
        onConfirm={refreshTemplateData}
        open={openDialog}
      >
        <Typography variant="body2">{t('sendMessage.refresh')}</Typography>
      </CommunicationWrapperDialog>
    );
  },
);

const useStyles = makeStyles((theme) => ({
  mailPreviewContainer: {
    borderRadius: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    border: 'solid 1px',
    borderColor: theme.palette.grey[100],
  },
  mailPreviewSubcontainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  mailPreviewButtonsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(1),
  },
  mailPreviewContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    overflow: 'hidden',
    height: '20vh',
  },
}));

export default React.memo(CommunicationWriteEmail);
