import React from 'react';
import { useTranslation } from 'react-i18next';

import { Theme, makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import TextFieldWithChildren from '#components/input/text-field/TextFieldWithChildren.component';

import {
  TEXTFIELD_NOTIFICATION_TITLE,
  TEXTFIELD_NOTIFICATION_CONTENT,
  MAX_LENGTH_PUSH_CONTENT,
  MAX_LENGTH_PUSH_TITLE,
} from '#libs/communication-v2/constants';

type Props = {
  children: any;
  handleChangeContent: (event: React.ChangeEvent) => void;
  handleChangeTitle: (event: React.ChangeEvent) => void;
  isMobileSize?: boolean;
  notificationContent: string;
  notificationTitle: string;
  onFocus: (identifier: number) => void;
};

const CommunicationWriteNotification = (props: Props) => {
  const { t } = useTranslation('communication');
  const classes = useStyles();
  const {
    handleChangeContent,
    handleChangeTitle,
    isMobileSize,
    notificationContent,
    notificationTitle,
    onFocus,
  } = props;
  const onTitleFocus = () => onFocus(TEXTFIELD_NOTIFICATION_TITLE);
  const onContentFocus = () => onFocus(TEXTFIELD_NOTIFICATION_CONTENT);
  return (
    <React.Fragment>
      <TextFieldWithChildren
        withMarginBottom
        changeValue={handleChangeTitle}
        inputProps={{ maxLength: MAX_LENGTH_PUSH_TITLE }}
        minRows={1}
        name="Mail title"
        onFocus={onTitleFocus}
        placeholder={t('sendMessage.textField.title')}
        value={notificationTitle}
      >
        <Typography className={classes.textFieldLengthTitle} variant="caption">
          {`${notificationTitle?.length ?? 0}/${MAX_LENGTH_PUSH_TITLE}`}
        </Typography>
      </TextFieldWithChildren>
      <TextFieldWithChildren
        withColumnDirection
        changeValue={handleChangeContent}
        inputProps={{ maxLength: MAX_LENGTH_PUSH_CONTENT }}
        minRows={isMobileSize ? 2 : 6}
        name="Mail content"
        onFocus={onContentFocus}
        placeholder={t('sendMessage.textField.content')}
        value={notificationContent}
      >
        <Typography
          className={classes.textFieldLengthContent}
          variant="caption"
        >
          {`${notificationContent?.length ?? 0}/${MAX_LENGTH_PUSH_CONTENT}`}
        </Typography>
        {props.children}
      </TextFieldWithChildren>
    </React.Fragment>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  textFieldLengthContent: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
    alignSelf: 'flex-end',
  },
  textFieldLengthTitle: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
}));

export default CommunicationWriteNotification;
