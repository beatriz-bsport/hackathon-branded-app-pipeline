import React from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Button,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useTranslation } from 'react-i18next';
import chroma from 'chroma-js';
import classNames from 'classnames';
import SeamlessImmutable from 'seamless-immutable';
import VimeoEmbedVideo from '#src/libs/video/components/VimeoEmbedVideo';
import { TutorialCompletion, TutorialLesson } from '../types';
import { isLessonCompleted } from '../utils';

export type Props = {
  selectedLesson: TutorialLesson;
  goToLesson: (sectionId: number | string, lessonId: number | string) => void;
  completeAndGoToLesson: (
    sectionId: number | string,
    currentId: number | string,
    nextId: number | string,
    firstFinish?: boolean,
  ) => void;
  completeAndGoToMenu: (
    curentId: number | string,
    sectionId?: number | string,
    firstFinish?: boolean,
  ) => void;
  previousLessonId: number | string;
  nextLessonId: number | string;
  lesson_restricted: boolean;
  tutorial_completion:
    | TutorialCompletion
    | SeamlessImmutable.Immutable<TutorialCompletion>;
};

const TutorialLessonContent: React.FC<Props> = (props: Props) => {
  const {
    selectedLesson,
    goToLesson,
    completeAndGoToLesson,
    completeAndGoToMenu,
    previousLessonId,
    nextLessonId,
    lesson_restricted,
    tutorial_completion,
  } = props;
  const { t } = useTranslation('tutorial');
  const classes = useStyles();
  const onNextButtonClick = () =>
    nextLessonId === null
      ? completeAndGoToMenu(
          selectedLesson.id,
          selectedLesson.section,
          !isLessonCompleted(selectedLesson, tutorial_completion),
        )
      : completeAndGoToLesson(
          selectedLesson.section,
          selectedLesson.id,
          nextLessonId,
          !isLessonCompleted(selectedLesson, tutorial_completion),
        );
  return (
    <Paper className={classes.paper} elevation={0}>
      <Typography className={classes.sectionTitle} variant="h5">
        {selectedLesson?.translated_name}
      </Typography>
      <div className={classes.lessonContent}>
        <div className={classes.videoContainer}>
          {!!selectedLesson.translated_videolink && (
            <VimeoEmbedVideo
              id={selectedLesson.translated_videolink.replace(
                'https://vimeo.com/',
                '',
              )}
            />
          )}
        </div>
        <ReactMarkdown className={classes.lessonText}>
          {selectedLesson?.translated_body}
        </ReactMarkdown>
        <div className={classes.buttons}>
          <Button
            className={classNames(classes.previousButton, {
              [classes.previousButtonDisabled]:
                previousLessonId === null || lesson_restricted,
            })}
            disabled={previousLessonId === null || lesson_restricted}
            onClick={() => goToLesson(selectedLesson.section, previousLessonId)}
            startIcon={<ArrowBackIcon />}
          >
            {t('lessonContent.previousLesson')}
          </Button>
          <Button
            classes={{ root: classes.overrideMuiButtonRootHoverMobile }}
            className={classNames(classes.nextButton)}
            disabled={lesson_restricted}
            endIcon={<ArrowForwardIcon />}
            onClick={onNextButtonClick}
          >
            {nextLessonId === null && !lesson_restricted
              ? t('lessonContent.finish')
              : t('lessonContent.nextLesson')}
          </Button>
        </div>
      </div>
    </Paper>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    width: '100%',
    height: '100%',

    minHeight: theme.spacing(20.5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'start',
    padding: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      paddingBottom: theme.spacing(1),
    },
  },
  sectionTitle: { marginRight: 'auto' },
  lessonContent: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: '80%',
    height: '100%',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },

  lessonText: {
    textAlign: 'justify',
    textJustify: 'inter-word',
    marginBottom: theme.spacing(7),
    overflowWrap: 'break-word',
  },

  buttons: {
    position: 'sticky',
    bottom: theme.spacing(-1),
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    backgroundColor: 'white',
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'center',
      flexWrap: 'wrap-reverse',
      gap: theme.spacing(1),
    },
  },
  videoContainer: {
    borderRadius: theme.spacing(3),
    overflow: 'hidden',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },

  playArrow: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    padding: theme.spacing(2),
    backgroundColor: chroma('white').alpha(0.3).hex(),
    color: 'white',
    borderRadius: '50%',
  },

  previousButton: {
    color: theme.palette.primary.main,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  previousButtonDisabled: {
    color: theme.palette.action.disabled,
  },

  nextButton: {
    backgroundColor: chroma(theme.palette.primary.main).alpha(0.1).hex(),
    color: theme.palette.primary.main,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  overrideMuiButtonRootHoverMobile: {
    [theme.breakpoints.down('sm')]: {
      '&:hover': {
        backgroundColor: chroma(theme.palette.primary.main).alpha(0.1).hex(),
      },
    },
  },
}));

export default TutorialLessonContent;
