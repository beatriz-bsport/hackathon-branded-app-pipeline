import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';

import { MemberMinimal } from '#libs/member/types';

import { AccessStatus } from '../../constants';

type Props = {
  open: boolean;
  member: MemberMinimal;
  accessStatus: AccessStatus;
  handleOpen: () => void;
  handleClose: () => void;
};

/**
 * Renders the content of the Access Control Snack Bar component.
 * This component is extracted to be exposed in Storybook.
 *
 * @param accessStatus - The access status of the member.
 * @param handleClose - The callback function to handle the close event.
 * @param handleOpen - The callback function to handle the open event.
 * @param member - The member object containing information about the member.
 */
export const AccessControlSnackBarContent: React.FC<Omit<Props, 'open'>> = ({
  accessStatus,
  handleClose,
  handleOpen,
  member,
}) => {
  const classes = useStyles({ accessStatus });
  const { t } = useTranslation('accessControl');

  return (
    <Paper className={classes.root}>
      <div className={classes.primaryContent}>
        <Avatar className={classes.avatar} src={member.photo} />
        <div className={classes.informationContainer}>
          <Typography
            className={classes.text2linesWithEllipsis}
            variant="body1"
          >
            <Trans
              i18nKey="accessControl:snackbar.message"
              values={{ name: member?.name }}
            />
          </Typography>
          <Typography className={classes.accessStatusText} variant="body1">
            {t(`snackbar.${accessStatus}`)}
          </Typography>
        </div>
      </div>
      <div className={classes.secondaryContent}>
        <Button className={classes.openButton} onClick={handleOpen}>
          <Typography>{t('common:open')}</Typography>
        </Button>
        <IconButton onClick={handleClose}>
          <CloseIcon htmlColor="white" />
        </IconButton>
      </div>
    </Paper>
  );
};

/**
 * Snackbar component that displays a message when a member checks in at the studio.
 *
 * @component
 * @param {string} props.accessStatus - The access status of the member.
 * @param {Function} props.handleClose - The function to close the snackbar.
 * @param {Function} props.handleOpen - The function to open the dedicated member visit page.
 * @param {object} props.member - The member object.
 * @param {boolean} props.open - Determines whether the snackbar is open or not.
 * @returns {JSX.Element} The rendered snackbar component.
 */
const AccessControlSnackBar: React.FC<Props> = ({
  accessStatus,
  handleClose,
  handleOpen,
  member,
  open,
}) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={open}
    >
      <AccessControlSnackBarContent
        accessStatus={accessStatus}
        handleClose={handleClose}
        handleOpen={handleOpen}
        member={member}
      />
    </Snackbar>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '585px',
    minWidth: '450px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: theme.spacing(1.75),
    paddingBottom: theme.spacing(1.75),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    backgroundColor: '#323232',
    color: theme.palette.common.white,
  },
  primaryContent: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  secondaryContent: {
    display: 'flex',
    alignItems: 'center',
  },
  informationContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  accessStatusText: {
    color: (props: { accessStatus: AccessStatus }) => {
      switch (props.accessStatus) {
        case 'G':
          return theme.palette.success.light;
        case 'R':
          return theme.palette.error.light;
        case 'O':
          return theme.palette.warning.light;
        default:
          return theme.palette.text.primary;
      }
    },
  },
  avatar: {
    border: `2px solid ${theme.palette.common.white}`,
    height: theme.spacing(6),
    width: theme.spacing(6),
  },
  openButton: {
    color: theme.palette.common.white,
  },
  text2linesWithEllipsis: {
    display: '-webkit-box',
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

export default React.memo(AccessControlSnackBar);
