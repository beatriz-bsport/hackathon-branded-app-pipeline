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
import { getTextColorFromRGB } from '../../../../../utils/color';
import { Communication } from '#libs/communication-v2/types';
import TypographyMultiline from '#components/typo/TypographyMultiline.component';
import CommunicationThreadNumberRecipients from './CommunicationThreadNumberRecipients.component';
import HTMLPreview from '#components/html/HTMLPreview.component';
import { interpolateHTMLWithTags } from '#components/html/utils';
import { Member } from '#libs/member/types';
import { ResolvedGenericTags } from '#libs/email-editor/types';

const useStyles = makeStyles<Theme, { reverse: boolean; withChannel: boolean }>(
  (theme) => ({
    container: (props) => ({
      width: '100%',
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
      paddingTop: props.withChannel ? theme.spacing(3) : theme.spacing(1),
      paddingBottom: theme.spacing(1),
      marginTop: props.withChannel ? theme.spacing(2) : theme.spacing(1),
      display: 'flex',
      justifyContent: props.reverse ? 'flex-start' : 'flex-end',
      [theme.breakpoints.down('sm')]: {
        paddingLeft: theme.spacing(1.5),
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
  }),
);

const sanitizeRegex = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;

type OwnProps = {
  channel: number;
  photos: Array<string>;
  communication: Communication;
  oneToOneThreadMember: Member;
  onShowInformationClick: () => void;
  onShowEmailTemplate: (title: string, html: string) => void;
  resolvedGenericTags: ResolvedGenericTags;
};

export type Props = OwnProps;

export const CommunicationThreadMessageBubble = (props: Props) => {
  const {
    communication,
    channel,
    oneToOneThreadMember,
    photos,
    onShowInformationClick,
    onShowEmailTemplate,
    resolvedGenericTags,
  } = props;

  const reverse = !!communication.is_answer;
  const withChannel = !!oneToOneThreadMember;
  const classes = useStyles({ reverse, withChannel });

  const { t } = useTranslation('communication');

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
        {!!channel && !!oneToOneThreadMember && (
          <div className={classes.channelContainer}>
            <Typography variant="body1" className={classes.channelText}>
              {t(`filter.choicesLabels.${channel}`)}
            </Typography>
          </div>
        )}
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
            <Typography variant="h6">{communicationTitle}</Typography>
          )}

          {communication.kind === COMMUNICATION_KIND_EMAIL &&
          communication.text.slice(0, 14).toUpperCase() === '<!DOCTYPE HTML' ? (
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
                  onShowEmailTemplate(communicationTitle, communicationContent)
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
          {!oneToOneThreadMember && (
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
