import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Theme, makeStyles, Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
} from '@material-ui/icons';

import TextFieldWithChildren from '#components/input/TextFieldWithChildren.component';
import CommunicationWrapperDialog from './CommunicationWrapperDialog.component';
import { EmailTemplateDetail } from '../../email-editor/types';

import { TEXTFIELD_MAIL_TITLE, TEXTFIELD_MAIL_CONTENT } from '../constants';

type Props = {
  children: any;
  emailContent: string;
  emailTemplateDetails: Array<EmailTemplateDetail>;
  emailTemplateSelected: number;
  emailTitle: string;
  handleChangeContent: (event: React.ChangeEvent) => void;
  handleChangeTitle: (event: React.ChangeEvent) => void;
  isMobileSize?: boolean;
  loadingTemplateDetails: boolean;
  onEditTemplate: () => void;
  onFocus: (identifier: number) => void;
  onSeeTemplate: () => void;
  onRemoveTemplate: () => void;
};

const CommunicationWriteEmail = (props: Props) => {
  const { t } = useTranslation('communication');
  const {
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
    onSeeTemplate,
  } = props;
  const [showRefreshDialog, setShowRefreshDialog] = useState(false);
  const onTitleFocus = () => onFocus(TEXTFIELD_MAIL_TITLE);
  const onContentFocus = () => onFocus(TEXTFIELD_MAIL_CONTENT);
  const onCloseDialog = () => setShowRefreshDialog(false);
  const onEditTemplate = () => {
    props.onEditTemplate();
    setShowRefreshDialog(true);
  };
  return (
    <React.Fragment>
      <TextFieldWithChildren
        placeholder={t('sendMessage.textField.object')}
        name="Mail title"
        value={emailTitle}
        changeValue={handleChangeTitle}
        minRows={1}
        withMarginBottom
        onFocus={onTitleFocus}
      />
      {emailTemplateSelected ? (
        <EmailPreview
          emailTemplateDetails={emailTemplateDetails}
          emailTemplateSelected={emailTemplateSelected}
          loadingTemplateDetails={loadingTemplateDetails}
          onEditTemplate={onEditTemplate}
          onRemoveTemplate={onRemoveTemplate}
          onSeeTemplate={onSeeTemplate}
        >
          {props.children}
        </EmailPreview>
      ) : (
        <TextFieldWithChildren
          placeholder={t('sendMessage.textField.content')}
          name="Mail content"
          value={emailContent}
          changeValue={handleChangeContent}
          minRows={isMobileSize ? 2 : 6}
          withColumnDirection
          onFocus={onContentFocus}
        >
          {props.children}
        </TextFieldWithChildren>
      )}
      {showRefreshDialog && (
        <RefreshDialog
          openDialog={showRefreshDialog}
          onCloseDialog={onCloseDialog}
        />
      )}
    </React.Fragment>
  );
};

type PreviewProps = {
  children: any;
  emailTemplateDetails: Array<EmailTemplateDetail>;
  emailTemplateSelected: number;
  loadingTemplateDetails: boolean;
  onSeeTemplate: () => void;
  onEditTemplate: () => void;
  onRemoveTemplate: () => void;
};

const EmailPreview = (props: PreviewProps) => {
  const classes = useStyles();
  const {
    emailTemplateSelected,
    emailTemplateDetails,
    loadingTemplateDetails,
    onSeeTemplate,
    onEditTemplate,
    onRemoveTemplate,
  } = props;
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
            <div
              // eslint-disable-next-line
              dangerouslySetInnerHTML={{
                __html: emailTemplateDetails.find(
                  (email) => email.id === emailTemplateSelected,
                ).html,
              }}
              className={classes.htmlPreview}
            />
          ) : (
            <CircularProgress />
          )}
        </div>
        <span />
      </div>
      {props.children}
    </div>
  );
};

type RefreshProps = {
  openDialog: boolean;
  onCloseDialog: () => void;
};

const RefreshDialog = (props: RefreshProps) => {
  const { t } = useTranslation('communication');
  const onRefreshPage = () => document.location.reload();
  return (
    <CommunicationWrapperDialog
      onCancel={props.onCloseDialog}
      onConfirm={onRefreshPage}
      buttonConfirmText={t('common.refresh')}
      buttonCancelText={t('common.cancel')}
      fullScreen={false}
      open={props.openDialog}
    >
      <Typography variant="body2">{t('sendMessage.refresh')}</Typography>
    </CommunicationWrapperDialog>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  htmlPreview: {
    overflow: 'hidden',
    maxHeight: '30vh',
  },
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
  },
}));
export default CommunicationWriteEmail;
