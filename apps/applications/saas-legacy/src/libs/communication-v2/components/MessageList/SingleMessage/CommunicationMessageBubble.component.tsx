import React, { memo, useCallback, useMemo } from 'react';
import { DateTime } from 'luxon';
import chroma from 'chroma-js';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import {
  Info,
  Error,
  InfoOutlined,
  MailOutlined as MailOutlinedIcon,
  NotificationsNone as NotificationOutlinedIcon,
  SmsOutlined as SmsOutlinedIcon,
} from '@material-ui/icons/';
import { ButtonBase, makeStyles, Theme, Box } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import {
  COMMUNICATION_KIND_EMAIL,
  COMMUNICATION_KIND_PUSH_NOTIFICATION,
  COMMUNICATION_KIND_SMS,
} from '@bsport/common/lib/master-data/communication-kind.js';
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Avatar from '@material-ui/core/Avatar';
import { COMMUNICATION_CHANNEL_SMARTLIST } from '@bsport/common/lib/master-data/communication-filters.js';
import Tooltip from '#src/components/Tooltip.component';
import type { CommunicationMessage } from '#src/libs/communication-v2/types';
import TypographyMultiline from '#src/components/typo/TypographyMultiline.component';
import HTMLPreview from '#src/components/html/HTMLPreview.component';
import {
  interpolateHTMLWithTags,
  findMemberAssociatedTagsInTagsGroups,
} from '#src/components/html/utils';
import {
  COMMUNICATION_SENT_SENDING_FAIL,
  COMMUNICATION_SENT_SENDING_PROCESSING,
  COMMUNICATION_SENT_SENDING_SUCCESS,
} from '#src/libs/communication-v2/constants';
import { getSmartlistChannelFromMetadata } from '#src/libs/communication-v2/utils';
import { useTagsAndCategories } from '#src/libs/communication-v2/hooks/useCommunicationsTools.hooks';
import CommunicationMessageNumberRecipients from '#src/libs/communication-v2/components/MessageList/SingleMessage/CommunicationMessageNumberRecipients.component';
import { useCommunicationContext } from '#src/libs/communication-v2/context/CommunicationDrawer.context';
import { getTextColorFromRGB } from '#src/utils/color';

import '../styles.css';

const useStyles = makeStyles<Theme, { reverse: boolean; withTopGap: boolean }>(
  (theme) => ({
    container: (props) => ({
      width: '100%',
      paddingLeft: props.reverse ? theme.spacing(9) : 4,
      paddingRight: theme.spacing(4),
      paddingTop: props.withTopGap ? theme.spacing(3) : theme.spacing(1),
      paddingBottom: theme.spacing(1),
      marginTop: props.withTopGap ? theme.spacing(2) : theme.spacing(1),
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
        ? theme.palette.grey[100]
        : theme.palette.primary.main,
      borderTopLeftRadius: theme.spacing(2),
      borderTopRightRadius: theme.spacing(2),
      borderBottomRightRadius: props.reverse
        ? theme.spacing(2)
        : theme.spacing(0.5),
      borderBottomLeftRadius: props.reverse
        ? theme.spacing(0.5)
        : theme.spacing(2),
      color: getTextColorFromRGB(
        props.reverse
          ? chroma(theme.palette.grey[100]).rgb()
          : chroma(theme.palette.primary.main).rgb(),
      ),
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
    messageBubbleHeader: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
    },
    communicationTitle: {
      flexWrap: 'wrap',
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
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
    infoIcon: (props) => ({
      color: getTextColorFromRGB(
        props.reverse
          ? chroma(theme.palette.grey[100]).rgb()
          : chroma(theme.palette.primary.main).rgb(),
      ),
    }),
    showInfo: {
      borderRadius: theme.spacing(0.5),
    },
    iconButton: {
      padding: 0,
    },
  }),
);

const sanitizeRegex = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;

type OwnProps = {
  onShowInformationClick: (communication: CommunicationMessage) => void;
  onShowEmailTemplate: (title: string, html: string) => void;
  communicationMessage: CommunicationMessage;
};

export type Props = OwnProps;

const CommunicationKindIcon = (props: { kind: number }) => {
  switch (props.kind) {
    case COMMUNICATION_KIND_EMAIL:
      return <MailOutlinedIcon />;
    case COMMUNICATION_KIND_SMS:
      return <SmsOutlinedIcon />;
    case COMMUNICATION_KIND_PUSH_NOTIFICATION:
      return <NotificationOutlinedIcon />;
    default:
      return null;
  }
};

export const CommunicationMessageBubble = (props: Props) => {
  const { onShowInformationClick, onShowEmailTemplate, communicationMessage } =
    props;
  const { communication, channel, photos, answerSourceMember } =
    communicationMessage;
  const { resolvedGenericTags } = useTagsAndCategories();
  const { communicationMember: oneToOneMessageMember } =
    useCommunicationContext();

  const reverse = !!communication.is_answer;
  const withChannel =
    (!!oneToOneMessageMember || channel === COMMUNICATION_CHANNEL_SMARTLIST) &&
    !reverse;
  const withAnswerPaddingTop = reverse && !oneToOneMessageMember;

  const classes = useStyles({
    reverse,
    withTopGap: withChannel || withAnswerPaddingTop,
  });
  const { t } = useTranslation('communication');

  const upperCaseContent = (
    communication.data?.body || communication.text
  ).toUpperCase();

  const shouldBeRenderedInHTML =
    upperCaseContent.startsWith('<!DOCTYPE HTML') ||
    upperCaseContent.startsWith('<HTML><BODY>');

  const finalChannel = useMemo(() => {
    const smartlistChannel = getSmartlistChannelFromMetadata(
      communication.metadata,
    );
    return !oneToOneMessageMember && smartlistChannel
      ? smartlistChannel
      : channel;
  }, [channel, communication, oneToOneMessageMember]);

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

  const tagsToInterpolate = useMemo(() => {
    let tagsForMember = {};
    if (oneToOneMessageMember) {
      if (communication.data && communication.data.tags_groups) {
        tagsForMember =
          findMemberAssociatedTagsInTagsGroups(
            oneToOneMessageMember.firstname,
            oneToOneMessageMember.lastname,
            communication.data.tags_groups,
          ) || [];
      } else {
        tagsForMember = {
          '{firstname}': oneToOneMessageMember.firstname,
          '{lastname}': oneToOneMessageMember.lastname,
          '{unsubscribe_link}': oneToOneMessageMember.unsubscribe_link,
        };
      }
    }
    return {
      ...resolvedGenericTags,
      ...tagsForMember,
    };
  }, [resolvedGenericTags, communication, oneToOneMessageMember]);

  const communicationContent = useMemo(() => {
    return interpolateHTMLWithTags(
      sanitizedHtml ?? communication.text,
      tagsToInterpolate,
    );
  }, [sanitizedHtml, communication.text, tagsToInterpolate]);

  const communicationTitle = useMemo(() => {
    return interpolateHTMLWithTags(
      communication.data.subject ?? communication.title,
      tagsToInterpolate,
    );
  }, [communication.data.subject, communication.title, tagsToInterpolate]);

  const handleShowCommunicationInformationClick = useCallback(() => {
    onShowInformationClick(communicationMessage);
  }, [onShowInformationClick, communicationMessage]);

  return (
    <div className={classes.container}>
      <div className={classes.messageInfoContainer}>
        {!!finalChannel && withChannel && (
          <div className={classes.channelContainer}>
            <Typography className={classes.channelText} variant="body1">
              {t(`filter.choicesLabels.${finalChannel}`)}
            </Typography>
          </div>
        )}
        {reverse && !!answerSourceMember && !oneToOneMessageMember && (
          <div className={classes.answerNameContainer}>
            <Typography color="textSecondary" variant="body1">
              {answerSourceMember.name}
            </Typography>
          </div>
        )}
        <div className={classes.messageBubbleContainer}>
          <div className={classes.messageBubble}>
            <div className={classes.row}>
              <div className={classes.messageBubbleHeader}>
                <Tooltip
                  placement="left-start"
                  title={t(`campaign.kind.${communication.kind}`)}
                >
                  <span className={classes.leftIcon}>
                    <CommunicationKindIcon kind={communication.kind} />
                  </span>
                </Tooltip>
                {[
                  COMMUNICATION_KIND_EMAIL,
                  COMMUNICATION_KIND_PUSH_NOTIFICATION,
                ].includes(communication.kind) && (
                  <Typography
                    className={classes.communicationTitle}
                    variant="subtitle1"
                  >
                    <Box fontWeight={500}>{communicationTitle}</Box>
                  </Typography>
                )}
              </div>
              {!reverse &&
                communication.status === COMMUNICATION_SENT_SENDING_SUCCESS && (
                  <IconButton
                    className={classes.iconButton}
                    onClick={handleShowCommunicationInformationClick}
                    size="small"
                  >
                    <InfoOutlined className={classes.infoIcon} />
                  </IconButton>
                )}
            </div>

            {communication.kind === COMMUNICATION_KIND_EMAIL &&
            shouldBeRenderedInHTML ? (
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
              <TypographyMultiline variant="body1">
                {communicationContent}
              </TypographyMultiline>
            )}
            {!oneToOneMessageMember &&
              !reverse &&
              communication.status === COMMUNICATION_SENT_SENDING_SUCCESS && (
                <ButtonBase
                  className={classes.showInfo}
                  onClick={handleShowCommunicationInformationClick}
                >
                  <CommunicationMessageNumberRecipients
                    numberRecipients={communication.total_recipients}
                    photos={photos}
                  />
                </ButtonBase>
              )}
            {reverse && !!answerSourceMember && (
              <Avatar
                alt=""
                className={classes.answerAvatar}
                src={answerSourceMember?.photo || ''}
              />
            )}
          </div>
        </div>
        <div
          className={clsx(
            classes.flexEnd,
            'bs-communication__message__bubble__footer__container',
            {
              'bs-communication__message__bubble__footer__align__end':
                !communication.is_answer,
            },
          )}
        >
          <Typography variant="subtitle1">
            {DateTime.fromISO(communication.date_created).toFormat('D - t')}
          </Typography>
          {reverse && !oneToOneMessageMember && (
            <Typography className={classes.answerWarning} variant="caption">
              {t('recipient.isAnswerWarning')}
            </Typography>
          )}
          {!reverse &&
            communication.status === COMMUNICATION_SENT_SENDING_FAIL && (
              <Typography
                className={clsx(
                  classes.statusContainer,
                  classes.statusFail,
                  'bs-communication__message__bubble__status__container',
                )}
                variant="body2"
              >
                <Error className={classes.statusIcon} fontSize="small" />
                {communication.error_code
                  ? t(`sentStatus.error_codes.${communication.error_code}`)
                  : t('sentStatus.fail')}
              </Typography>
            )}
          {!reverse &&
            communication.status === COMMUNICATION_SENT_SENDING_PROCESSING && (
              <Typography
                className={clsx(
                  classes.statusContainer,
                  classes.statusProcessing,
                  'bs-communication__message__bubble__status__container',
                )}
                variant="body2"
              >
                <Info className={classes.statusIcon} fontSize="small" />
                {t('sentStatus.processing')}
              </Typography>
            )}
        </div>
      </div>
    </div>
  );
};

export default memo(CommunicationMessageBubble);
