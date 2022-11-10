import React, { useMemo } from 'react';
import chroma from 'chroma-js';
import moment from 'moment-timezone';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import { Info, Error, InfoOutlined } from '@material-ui/icons/';

import { ButtonBase, makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import {
  COMMUNICATION_KIND_EMAIL,
  COMMUNICATION_KIND_PUSH_NOTIFICATION,
} from '@bsport/common/lib/master-data/communication-kind';
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Avatar from '@material-ui/core/Avatar';
import { COMMUNICATION_CHANNEL_SMARTLIST } from '@bsport/common/lib/master-data/communication-filters';
import { getTextColorFromRGB } from '../../../../../utils/color';
import { ThreadCommunication } from '#libs/communication-v2/types';
import TypographyMultiline from '#components/typo/TypographyMultiline.component';
import CommunicationThreadNumberRecipients from './CommunicationThreadNumberRecipients.component';
import HTMLPreview from '#components/html/HTMLPreview.component';
import { interpolateHTMLWithTags } from '#components/html/utils';
import { Member } from '#libs/member/types';
import { ResolvedGenericTags } from '#libs/email-editor/types';
import {
  COMMUNICATION_SENT_SENDING_FAIL,
  COMMUNICATION_SENT_SENDING_PROCESSING,
  COMMUNICATION_SENT_SENDING_SUCCESS,
} from '#libs/communication-v2/constants';
import { getSmartlistChannelFromMetadata } from '#libs/communication-v2/utils';

const useStyles = makeStyles<Theme, { reverse: boolean; withChannel: boolean }>(
  (theme) => ({
    container: (props) => ({
      width: '100%',
      paddingLeft: props.reverse ? theme.spacing(9) : 4,
      paddingRight: theme.spacing(4),
      paddingTop: props.withChannel ? theme.spacing(3) : theme.spacing(1),
      paddingBottom: theme.spacing(1),
      marginTop: props.withChannel ? theme.spacing(2) : theme.spacing(1),
      display: 'flex',
      justifyContent: props.reverse ? 'flex-start' : 'flex-end',
      [theme.breakpoints.down('sm')]: {
        paddingLeft: props.reverse ? theme.spacing(6.5) : theme.spacing(1.5),
        paddingRight: theme.spacing(1.5),
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
      background: props.reverse
        ? chroma(theme.palette.primary.main).alpha(0.15).hex()
        : theme.palette.grey[100],
      borderTopLeftRadius: theme.spacing(2),
      borderTopRightRadius: theme.spacing(2),
      borderBottomRightRadius: props.reverse
        ? theme.spacing(2)
        : theme.spacing(0.5),
      borderBottomLeftRadius: props.reverse
        ? theme.spacing(0.5)
        : theme.spacing(2),
      padding: theme.spacing(1.5),
      position: 'relative',
    }),
    messageBubbleContainer: (props) => ({
      backgroundColor: theme.palette.background.paper,
      borderTopLeftRadius: theme.spacing(2),
      borderTopRightRadius: theme.spacing(2),
      borderBottomRightRadius: props.reverse
        ? theme.spacing(2)
        : theme.spacing(0.5),
      borderBottomLeftRadius: props.reverse
        ? theme.spacing(0.5)
        : theme.spacing(2),
    }),
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    flexEnd: (props) => ({
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: props.reverse ? 'row' : 'row-reverse',
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column-reverse',
        alignItems: props.reverse ? 'flex-start' : 'flex-end',
      },
    }),
    channelContainer: (props) => {
      const backgroundColorChroma = chroma(theme.palette.primary.main).alpha(
        0.5,
      );
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
      maxHeight: '20vh',
      width: '100%',
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
    answerAvatar: {
      position: 'absolute',
      bottom: 0,
      left: -theme.spacing(5),
      width: theme.spacing(4),
      height: theme.spacing(4),
    },
    answerNameContainer: {
      position: 'absolute',
      top: -theme.spacing(3),
      left: 0,
    },
    answerWarning: {
      color: theme.palette.warning.dark,
      marginLeft: theme.spacing(2),
      display: 'flex',
      alignItems: 'center',
      [theme.breakpoints.down('xs')]: {
        marginLeft: 0,
      },
    },
    statusFail: {
      color: theme.palette.error.dark,
    },
    statusProcessing: {
      color: theme.palette.info.dark,
    },
    statusContainer: {
      borderRadius: theme.spacing(0.5),
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      textAlign: 'right',
      width: 'fit-content',
      alignItems: 'center',
      display: 'flex',
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(0.5),
    },
    statusIcon: {
      marginRight: theme.spacing(1),
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
  }),
);

const sanitizeRegex = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;

type OwnProps = {
  oneToOneThreadMember: Member;
  onShowInformationClick: () => void;
  onShowEmailTemplate: (title: string, html: string) => void;
  resolvedGenericTags: ResolvedGenericTags;
  threadCommunication: ThreadCommunication;
};

export type Props = OwnProps;

export const CommunicationThreadMessageBubble = (props: Props) => {
  const {
    oneToOneThreadMember,
    onShowInformationClick,
    onShowEmailTemplate,
    resolvedGenericTags,
    threadCommunication,
  } = props;
  const { communication, channel, photos, answerSourceMember } =
    threadCommunication;

  const reverse = !!communication.is_answer;
  const withChannel =
    !!oneToOneThreadMember || channel === COMMUNICATION_CHANNEL_SMARTLIST;

  const classes = useStyles({ reverse, withChannel });
  const { t } = useTranslation('communication');

  const finalChannel = useMemo(() => {
    const smartlistChannel = getSmartlistChannelFromMetadata(
      communication.metadata,
    );
    return !oneToOneThreadMember && smartlistChannel
      ? smartlistChannel
      : channel;
  }, [channel, communication, oneToOneThreadMember]);

  const sanitizedHtml = useMemo(() => {
    let html;
    if (communication.kind === COMMUNICATION_KIND_EMAIL) {
      html = (communication.data.body ?? communication.text).replace(
        sanitizeRegex,
        '',
      );
    }
    return html;
  }, [communication]);
  const communicationContent = useMemo(() => {
    let content = interpolateHTMLWithTags(
      sanitizedHtml ?? communication.text,
      resolvedGenericTags,
    );
    if (oneToOneThreadMember) {
      content = interpolateHTMLWithTags(content, {
        '{firstname}': oneToOneThreadMember.firstname,
        '{lastname}': oneToOneThreadMember.lastname,
      });
    }
    return content;
  }, [
    sanitizedHtml,
    communication.text,
    oneToOneThreadMember,
    resolvedGenericTags,
  ]);
  const communicationTitle = useMemo(() => {
    let content = interpolateHTMLWithTags(
      communication.data.subject ?? communication.title,
      resolvedGenericTags,
    );
    if (oneToOneThreadMember) {
      content = interpolateHTMLWithTags(content, {
        '{firstname}': oneToOneThreadMember.firstname,
        '{lastname}': oneToOneThreadMember.lastname,
      });
    }
    return content;
  }, [
    communication.data.subject,
    communication.title,
    oneToOneThreadMember,
    resolvedGenericTags,
  ]);
  return (
    <div className={classes.container}>
      <div className={classes.messageInfoContainer}>
        {!!finalChannel && withChannel && (
          <div className={classes.channelContainer}>
            <Typography variant="body1" className={classes.channelText}>
              {t(`filter.choicesLabels.${finalChannel}`)}
            </Typography>
          </div>
        )}
        {reverse && !!answerSourceMember && !oneToOneThreadMember && (
          <div className={classes.answerNameContainer}>
            <Typography variant="body1" color="textSecondary">
              {answerSourceMember.name}
            </Typography>
          </div>
        )}
        <div className={classes.messageBubbleContainer}>
          <div className={classes.messageBubble}>
            <div className={classes.row}>
              <Typography variant="h6">
                {t(`campaign.kind.${communication.kind}`)}
              </Typography>
              {!reverse &&
                communication.status === COMMUNICATION_SENT_SENDING_SUCCESS && (
                  <IconButton size="small" onClick={onShowInformationClick}>
                    <InfoOutlined />
                  </IconButton>
                )}
            </div>
            {[
              COMMUNICATION_KIND_EMAIL,
              COMMUNICATION_KIND_PUSH_NOTIFICATION,
            ].includes(communication.kind) && (
              <Typography variant="h5">{communicationTitle}</Typography>
            )}

            {communication.kind === COMMUNICATION_KIND_EMAIL &&
            (communication.data?.body || communication.text)
              .toUpperCase()
              .startsWith('<!DOCTYPE HTML') ? (
              <>
                <div className={classes.htmlPreview}>
                  <HTMLPreview
                    html={communicationContent}
                    resolvedGenericTags={resolvedGenericTags}
                  />
                </div>
                <ButtonBase
                  className={classes.showEmail}
                  onClick={() =>
                    onShowEmailTemplate(
                      communicationTitle,
                      communicationContent,
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
              // @ts-ignore
              <TypographyMultiline variant="body1">
                {communicationContent}
              </TypographyMultiline>
            )}
            {!oneToOneThreadMember &&
              !reverse &&
              communication.status === COMMUNICATION_SENT_SENDING_SUCCESS && (
                <CommunicationThreadNumberRecipients
                  photos={photos}
                  numberRecipients={communication.total_recipients}
                />
              )}
            {reverse && !!answerSourceMember && (
              <Avatar
                src={answerSourceMember?.photo || ''}
                alt=""
                className={classes.answerAvatar}
              />
            )}
          </div>
        </div>
        <div className={classes.flexEnd}>
          <Typography variant="subtitle1">
            {moment(communication.date_created).format('L - LT')}
          </Typography>
          {reverse && !oneToOneThreadMember && (
            <Typography className={classes.answerWarning} variant="caption">
              {t('recipient.isAnswerWarning')}
            </Typography>
          )}
          {!reverse &&
            communication.status === COMMUNICATION_SENT_SENDING_FAIL && (
              <Typography
                className={classNames(
                  classes.statusContainer,
                  classes.statusFail,
                )}
                variant="body2"
              >
                <Error fontSize="small" className={classes.statusIcon} />
                {t('sentStatus.fail')}
              </Typography>
            )}
          {!reverse &&
            communication.status === COMMUNICATION_SENT_SENDING_PROCESSING && (
              <Typography
                className={classNames(
                  classes.statusContainer,
                  classes.statusProcessing,
                )}
                variant="body2"
              >
                <Info fontSize="small" className={classes.statusIcon} />
                {t('sentStatus.processing')}
              </Typography>
            )}
        </div>
      </div>
    </div>
  );
};

export default CommunicationThreadMessageBubble;
