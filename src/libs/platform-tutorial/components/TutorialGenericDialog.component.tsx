import React from 'react';
import { Button, Theme, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useTranslation } from 'react-i18next';
import chroma from 'chroma-js';
import { TFunction } from 'i18next';
import ShareIcon from '@material-ui/icons/Share';
import CheckIcon from '#components/icons/CheckIcon.component';
import AnimatedWelcomeIcon from '#components/animations/AnimatedWelcomeIcon.component';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';
import {
  TUTORIAL_GENERIC_DIALOG_WELCOME,
  TUTORIAL_GENERIC_DIALOG_SECTION_FINISH,
  TUTORIAL_GENERIC_DIALOG_ALL_FINISH,
  TUTORIAL_GENERIC_DIALOG_SHARE_SECTION,
  TUTORIAL_GENERIC_DIALOG_SHARE_LESSON,
} from '#libs/platform-tutorial/constant';
import { TutorialLesson, TutorialSection } from '../types';

type IdentifierType =
  | typeof TUTORIAL_GENERIC_DIALOG_WELCOME
  | typeof TUTORIAL_GENERIC_DIALOG_SECTION_FINISH
  | typeof TUTORIAL_GENERIC_DIALOG_ALL_FINISH
  | typeof TUTORIAL_GENERIC_DIALOG_SHARE_SECTION
  | typeof TUTORIAL_GENERIC_DIALOG_SHARE_LESSON;

const getTextDictionary = (
  identifier: IdentifierType,
  t: TFunction,
  name?: string,
) => {
  switch (identifier) {
    case TUTORIAL_GENERIC_DIALOG_WELCOME:
      return {
        title: t('welcomeDialog.title'),
        infoText: t('welcomeDialog.infoText'),
        rejectButton: t('welcomeDialog.rejectButton'),
        approveButton: t('welcomeDialog.approveButton'),
      };
    case TUTORIAL_GENERIC_DIALOG_SECTION_FINISH:
      return {
        title: t('sectionFinishDialog.title'),
        infoText: t('sectionFinishDialog.infoText', { name }),
        continueButton: t('sectionFinishDialog.continueButton'),
      };
    case TUTORIAL_GENERIC_DIALOG_ALL_FINISH:
      return {
        title: t('tutorial:allFinishDialog.title'),
        infoText: t('allFinishDialog.infoText'),
        continueButton: t('allFinishDialog.continueButton'),
      };
    case TUTORIAL_GENERIC_DIALOG_SHARE_SECTION:
      return {
        title: t('shareDialog.title'),
        infoText: t('shareDialog.infoTextSection', { name }),
        continueButton: t('shareDialog.continueButton'),
      };
    case TUTORIAL_GENERIC_DIALOG_SHARE_LESSON:
      return {
        title: t('shareDialog.title'),
        infoText: t('shareDialog.infoTextLesson', { name }),
        continueButton: t('shareDialog.continueButton'),
      };
    default:
      return null;
  }
};

const GenericIcon: React.FC<{
  identifier: IdentifierType;
}> = ({ identifier }) => {
  const classes = useStyles();
  switch (identifier) {
    case TUTORIAL_GENERIC_DIALOG_WELCOME:
      return <AnimatedWelcomeIcon />;
    case TUTORIAL_GENERIC_DIALOG_SECTION_FINISH:
    case TUTORIAL_GENERIC_DIALOG_ALL_FINISH:
      return (
        <div className={classes.checkIcon}>
          <CheckIcon />
        </div>
      );
    case TUTORIAL_GENERIC_DIALOG_SHARE_SECTION:
    case TUTORIAL_GENERIC_DIALOG_SHARE_LESSON:
      return <ShareIcon color="secondary" fontSize="inherit" />;
    default:
      return <></>;
  }
};

type TextDictionaryProps = {
  title: string;
  infoText: string;
  rejectButton?: string;
  approveButton?: string;
  continueButton?: string;
};
const GenericButtons: React.FC<{
  identifier: IdentifierType;
  textDictionary: TextDictionaryProps;
  onClose: () => void;
  onCancel?: () => void;
}> = ({ identifier, onClose, onCancel, textDictionary }) => {
  const classes = useStyles();
  switch (identifier) {
    case TUTORIAL_GENERIC_DIALOG_WELCOME:
      return (
        <div className={classes.buttons}>
          {onCancel && (
            <Button className={classes.rejectButton} onClick={onCancel}>
              {textDictionary?.rejectButton}
            </Button>
          )}
          <Button
            className={classes.approveButton}
            color="primary"
            onClick={onClose}
            variant="contained"
          >
            {textDictionary?.approveButton}
          </Button>
        </div>
      );
    case TUTORIAL_GENERIC_DIALOG_SECTION_FINISH:
    case TUTORIAL_GENERIC_DIALOG_ALL_FINISH:
      return (
        <Button
          className={classes.continueButton}
          color="primary"
          onClick={onClose}
          variant="contained"
        >
          {textDictionary?.continueButton}
        </Button>
      );
    case TUTORIAL_GENERIC_DIALOG_SHARE_SECTION:
      return (
        <Button
          className={classes.continueButton}
          color="primary"
          onClick={onClose}
          variant="contained"
        >
          {textDictionary?.continueButton}
        </Button>
      );

    case TUTORIAL_GENERIC_DIALOG_SHARE_LESSON:
      return (
        <Button
          className={classes.continueButton}
          color="primary"
          onClick={onClose}
          variant="contained"
        >
          {textDictionary?.continueButton}
        </Button>
      );
    default:
      return <></>;
  }
};

export type Props = {
  open: boolean;
  identifier: IdentifierType;
  onClose: (object?: TutorialSection | TutorialLesson | null) => void;
  onCancel?: () => void;
  object?: TutorialSection | TutorialLesson | null;
};

const TutorialGenericDialog: React.FC<Props> = (props: Props) => {
  const { open, identifier, onClose, onCancel, object } = props;
  const classes = useStyles();
  const { t } = useTranslation('tutorial');
  const textDictionary = getTextDictionary(
    identifier,
    t,
    object?.translated_name,
  );
  return (
    <>
      <GenericResponsiveDialog open={open}>
        <div className={classes.container} id="animated_icon_triggerer">
          <div className={classes.box}>
            <GenericIcon identifier={identifier} />
          </div>
          <Typography variant="h4">{textDictionary?.title}</Typography>
          <Typography className={classes.infoText} variant="body1">
            {textDictionary?.infoText}
          </Typography>
          <GenericButtons
            identifier={identifier}
            onCancel={onCancel}
            onClose={() => onClose(object)}
            textDictionary={textDictionary}
          />
        </div>
      </GenericResponsiveDialog>
    </>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  '@keyframes myRotationEffect': {
    '0%': {
      transform: 'rotate(0deg)',
      transformOrigin: '90% 90%',
    },
    '50%': {
      transform: 'rotate(4deg)',
      transformOrigin: '90% 90%',
    },
    '100%': {
      transform: 'rotate(0deg)',
      transformOrigin: '100% 90%',
    },
  },
  '@keyframes myOutterTranslationEffect': {
    '0%': {
      transform: 'rotate(0deg)',
      transformOrigin: '90% 90%',
    },
    '50%': {
      transform: 'rotate(8deg)',
      transformOrigin: '90% 90%',
    },
    '100%': {
      transform: 'rotate(0deg)',
      transformOrigin: '100% 90%',
    },
  },
  '@keyframes myOutterTranslationEffect2': {
    '0%': {
      transform: 'rotate(0deg)',
      transformOrigin: '90% 90%',
    },
    '50%': {
      transform: 'rotate(-4deg)',
      transformOrigin: '90% 90%',
    },
    '100%': {
      transform: 'rotate(0deg)',
      transformOrigin: '100% 90%',
    },
  },
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(4),
    boxSizing: 'border-box',
    gap: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      height: '100%',
    },
    '&:hover #main_mano': {
      animation: '$myRotationEffect 0.75s',
      animationIterationCount: 1,
    },
    '&:hover #main_mano_small_part': {
      animation: '$myRotationEffect 0.75s',
      animationIterationCount: 1,
    },
    '&:hover #outter_wave_top_big': {
      animation: '$myOutterTranslationEffect 0.75s',
      animationIterationCount: 1,
    },
    '&:hover #outter_wave_top_small': {
      animation: '$myOutterTranslationEffect 0.75s',
      animationIterationCount: 1,
    },
    '&:hover #outter_wave_bottom_small': {
      animation: '$myOutterTranslationEffect2 0.75s',
      animationIterationCount: 1,
    },
    '&:hover #outter_wave_bottom_big': {
      animation: '$myOutterTranslationEffect2 0.75s',
      animationIterationCount: 1,
    },
  },
  box: {
    width: theme.spacing(14),
    height: theme.spacing(14),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    backgroundColor: chroma(theme.palette.info.light).alpha(0.1).hex(),
    fontSize: theme.spacing(9),
    [theme.breakpoints.down('sm')]: {
      marginTop: 'auto',
    },
  },
  checkIcon: {
    position: 'relative',
    left: theme.spacing(2),
  },
  shareIcon: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  infoText: {
    textAlign: 'center',
    marginBottom: theme.spacing(5),
  },
  buttons: {
    marginTop: 'auto',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
      flexWrap: 'wrap-reverse',
      gap: theme.spacing(1),
    },
  },
  rejectButton: {
    color: chroma('black').alpha(0.54).hex(),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  approveButton: {
    color: 'white',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  continueButton: {
    marginTop: 'auto',
    color: 'white',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
}));

export default TutorialGenericDialog;
