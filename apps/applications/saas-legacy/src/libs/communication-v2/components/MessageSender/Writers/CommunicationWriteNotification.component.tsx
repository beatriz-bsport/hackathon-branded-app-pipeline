import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import TextFieldWithChildren from '#src/components/input/text-field/TextFieldWithChildren';

import {
  TEXTFIELD_NOTIFICATION_TITLE,
  TEXTFIELD_NOTIFICATION_CONTENT,
  MAX_LENGTH_PUSH_CONTENT,
  MAX_LENGTH_PUSH_TITLE,
} from '#src/libs/communication-v2/constants';

type Props = {
  children: React.ReactNode;
  handleChangeContent: (event: React.ChangeEvent) => void;
  handleChangeTitle: (event: React.ChangeEvent) => void;
  isMobileSize?: boolean;
  minimalBottom?: boolean; // for specific use such as sequential marketing
  notificationContent: string;
  notificationTitle: string;
  onFocus?: (identifier: number) => void;
};

const CommunicationWriteNotification: React.FC<Props> = ({
  children,
  handleChangeContent,
  handleChangeTitle,
  isMobileSize,
  minimalBottom,
  notificationContent,
  notificationTitle,
  onFocus,
}) => {
  const { t } = useTranslation('communication');

  const classes = useStyles();

  const onTitleFocus = React.useCallback(
    () => onFocus?.(TEXTFIELD_NOTIFICATION_TITLE),
    [onFocus],
  );

  const onContentFocus = React.useCallback(
    () => onFocus?.(TEXTFIELD_NOTIFICATION_CONTENT),
    [onFocus],
  );

  return (
    <React.Fragment>
      <TextFieldWithChildren
        changeValue={handleChangeTitle}
        customOptions={{
          margin: { bottom: true },
          rows: { minRows: 1 },
          focus: { onFocus: onTitleFocus },
        }}
        inputProps={{ maxLength: MAX_LENGTH_PUSH_TITLE }}
        name="Mail title"
        placeholder={t('sendMessage.textField.title')}
        value={notificationTitle}
      >
        <Typography className={classes.textFieldLengthTitle} variant="caption">
          {`${notificationTitle?.length ?? 0}/${MAX_LENGTH_PUSH_TITLE}`}
        </Typography>
      </TextFieldWithChildren>
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
        inputProps={{ maxLength: MAX_LENGTH_PUSH_CONTENT }}
        name="Mail content"
        placeholder={t('sendMessage.textField.content')}
        value={notificationContent}
      >
        <div
          className={classNames({
            [classes.bottom]: !minimalBottom,
            [classes.minimalBottom]: minimalBottom,
          })}
        >
          {minimalBottom && children}
          <Typography
            className={classes.textFieldLengthContent}
            variant="caption"
          >
            {`${notificationContent?.length ?? 0}/${MAX_LENGTH_PUSH_CONTENT}`}
          </Typography>
          {!minimalBottom && children}
        </div>
      </TextFieldWithChildren>
    </React.Fragment>
  );
};

const useStyles = makeStyles((theme) => ({
  textFieldLengthContent: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
    alignSelf: 'flex-end',
  },
  textFieldLengthTitle: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  minimalBottom: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottom: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
  },
}));

export default React.memo(CommunicationWriteNotification);
