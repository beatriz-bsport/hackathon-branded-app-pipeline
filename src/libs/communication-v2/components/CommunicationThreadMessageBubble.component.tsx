import React, { useMemo } from 'react';
import chroma from 'chroma-js';
import moment from 'moment-timezone';

import Typography from '@material-ui/core/Typography';
import InfoOutlined from '@material-ui/icons/InfoOutlined';

import { ButtonBase, makeStyles, Theme } from '@material-ui/core';
import { blueGrey } from '@material-ui/core/colors';
import { useTranslation } from 'react-i18next';
import {
  COMMUNICATION_KIND_EMAIL,
  COMMUNICATION_KIND_PUSH_NOTIFICATION,
} from '@bsport/common/lib/master-data/communication-kind';
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { getTextColorFromRGB } from '../../../utils/color';
import { Communication } from '../types';
import TypographyMultiline from '#components/typo/TypographyMultiline.component';
import CommunicationThreadNumberRecipients from './CommunicationThreadNumberRecipients.component';

const useStyles = makeStyles<Theme, { reverse: boolean }>((theme) => ({
  container: (props) => ({
    width: '100%',
    padding: theme.spacing(4),
    paddingBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: props.reverse ? 'flex-start' : 'flex-end',
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(1.5),
      paddingRight: theme.spacing(1.5),
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(2),
    },
  }),
  messageInfoContainer: {
    width: '70%',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      width: '80%',
    },
    zIndex: 2,
  },
  messageBubble: (props) => ({
    background: props.reverse ? blueGrey[50] : theme.palette.grey[100],
    borderTopLeftRadius: theme.spacing(2),
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: props.reverse
      ? theme.spacing(2)
      : theme.spacing(0.5),
    borderBottomLeftRadius: props.reverse
      ? theme.spacing(0.5)
      : theme.spacing(2),
    padding: theme.spacing(1.5),
  }),
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexEnd: (props) => ({
    display: 'flex',
    justifyContent: props.reverse ? 'flex-start' : 'flex-end',
  }),
  channelContainer: (props) => {
    const backgroundColorChroma = chroma(theme.palette.primary.main).alpha(0.5);
    const absolutePosition = props.reverse
      ? { right: 0 - theme.spacing(1.5) }
      : { left: 0 - theme.spacing(1.5) };
    return {
      ...absolutePosition,
      position: 'absolute',
      top: 0 - theme.spacing(4.5),
      background: backgroundColorChroma.hex(),
      borderRadius: theme.spacing(2),
      zIndex: -1,
      padding: theme.spacing(1.5),
    };
  },
  channelText: {
    color: getTextColorFromRGB(
      chroma(theme.palette.primary.main).alpha(0.5).rgb(),
    ),
  },
  htmlPreview: {
    overflow: 'hidden',
    maxHeight: '40vh',
  },
  showEmail: {
    display: 'flex',
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(2),
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: theme.spacing(0.5),
  },
}));

const sanitizeRegex = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;

type OwnProps = {
  channel: string;
  photos: Array<string>;
  communication: Communication;
  isSingleRecipientThread: boolean;
  onShowInformationClick: () => void;
  onShowEmailTemplate: (title: string, html: string) => void;
  reverse?: boolean;
};

export type Props = OwnProps;

export const CommunicationThreadMessageBubble = (props: Props) => {
  const {
    communication,
    channel,
    isSingleRecipientThread,
    photos,
    onShowInformationClick,
    onShowEmailTemplate,
    reverse,
  } = props;

  const classes = useStyles({ reverse });

  const { t } = useTranslation('communication');

  const sanitizedHtml = useMemo(() => {
    let html;
    if (communication.kind === COMMUNICATION_KIND_EMAIL) {
      html = communication.data.body.replace(sanitizeRegex, '');
    }
    return html;
  }, [communication]);

  return (
    <div className={classes.container}>
      <div className={classes.messageInfoContainer}>
        <div className={classes.channelContainer}>
          <Typography variant="body1" className={classes.channelText}>
            {channel}
          </Typography>
        </div>
        <div className={classes.messageBubble}>
          <div className={classes.row}>
            <Typography variant="h5">
              {t(`campaign.kind.${communication.kind}`)}
            </Typography>
            <IconButton size="small" onClick={onShowInformationClick}>
              <InfoOutlined />
            </IconButton>
          </div>
          {[
            COMMUNICATION_KIND_EMAIL,
            COMMUNICATION_KIND_PUSH_NOTIFICATION,
          ].includes(communication.kind) && (
            <Typography variant="h6">{communication.data.subject}</Typography>
          )}

          {communication.kind === COMMUNICATION_KIND_EMAIL ? (
            <>
              <div
                className={classes.htmlPreview}
                // eslint-disable-next-line
                dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
              />
              <ButtonBase
                className={classes.showEmail}
                onClick={() =>
                  onShowEmailTemplate(
                    communication.data.subject,
                    communication.data.body,
                  )
                }
              >
                <VisibilityIcon className={classes.leftIcon} />
                <Typography variant="button">
                  {t('recipient.showEmail')}
                </Typography>
              </ButtonBase>
            </>
          ) : (
            <TypographyMultiline variant="body1">
              {communication.data.body}
            </TypographyMultiline>
          )}
          {!isSingleRecipientThread && (
            <CommunicationThreadNumberRecipients
              photos={photos}
              numberRecipients={communication.total_recipients}
            />
          )}
        </div>
        <div className={classes.flexEnd}>
          <Typography variant="subtitle1">
            {moment(communication.date_created).format('L - LT')}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default CommunicationThreadMessageBubble;
