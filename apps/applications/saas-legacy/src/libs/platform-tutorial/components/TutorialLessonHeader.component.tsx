import React from 'react';

import chroma from 'chroma-js';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import {
  Button,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';
import HelpOutlinedIcon from '@material-ui/icons/HelpOutline';
import { Skeleton } from '@material-ui/lab';
import SeamlessImmutable from 'seamless-immutable';

// @ts-expect-error
import FeatureListProvider from '#src/libs/company/hocs/feature-list-provider.hoc';
import ToolTip from '#src/components/Tooltip.component';
import MuiIcon from '#src/components/MuiIcon.component';
import InfoBox from '#src/components/box/InfoBox.component';

import type { FeatureList } from '#src/libs/company/types';
import LessonStatusChips from './TutorialLessonStatusChip.component';
import { isLessonCompleted, isUpsellNotSubscribed } from '../utils';
import type {
  TutorialCompletion,
  TutorialLesson,
  TutorialSection,
} from '../types';

export type Props = {
  selectedLesson: TutorialLesson;
  section: TutorialSection;
  tutorial_completion:
    | TutorialCompletion
    | SeamlessImmutable.Immutable<TutorialCompletion>;
  goToLesson: (sectionId: number | string, lessonId: number | string) => void;
  onKnowMore: (id: number) => void;
};

const TutorialLessonHeader: React.FC<Props> = ({
  section,
  selectedLesson,
  tutorial_completion,
  goToLesson,
  onKnowMore,
}: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['tutorial', 'platformBilling']);
  const sectionCompleted =
    (
      section?.lessons?.filter(
        (lesson) => !isLessonCompleted(lesson, tutorial_completion),
      ) || []
    ).length === 0;
  const handleKnowMore = React.useCallback(() => {
    selectedLesson && onKnowMore(selectedLesson.upsell_identifiers[0]);
  }, [selectedLesson, onKnowMore]);

  if (!section) {
    return (
      <Paper className={classes.paper} elevation={0}>
        <div className={clsx(classes.secondRow, classes.skeleton)}>
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={`skeleton_${idx}`} style={{ width: '100%' }}>
              <Skeleton
                animation="wave"
                height={30}
                variant="text"
                width="80%"
              />
            </div>
          ))}
        </div>
      </Paper>
    );
  }

  return (
    <Paper className={classes.paper} elevation={0}>
      <div className={classes.firstRow}>
        <div
          className={clsx(
            classes.box,
            {
              [classes.boxPrimary]: sectionCompleted,
            },
            {
              [classes.boxGrey]: !sectionCompleted,
            },
          )}
        >
          <MuiIcon
            className={clsx(
              {
                [classes.iconPrimary]: sectionCompleted,
              },
              {
                [classes.iconDisabled]: !sectionCompleted,
              },
            )}
            defaultIcon="BusinessCenter"
            icon={section?.icon || ''}
          />
        </div>
        <Typography className={classes.textContainer} variant="h4">
          {section?.translated_name}
        </Typography>
        <LessonStatusChips lesson={selectedLesson} />
      </div>
      <div className={classes.secondRow}>
        <PlayArrowIcon className={classes.icon} color="primary" />
        {section?.lessons?.map((lesson) => {
          return (
            <ToolTip
              key={`lesson_button_${lesson.id}`}
              placement="bottom"
              title={lesson?.translated_name || ''}
            >
              <Button
                disableElevation
                classes={{
                  root: clsx(classes.rootButton, {
                    [classes.overrideMuiLessonCompletedButtonRootHoverMobile]:
                      isLessonCompleted(lesson, tutorial_completion),
                    [classes.overrideMuiLessonSelectedButtonRootHoverMobile]:
                      selectedLesson.id === lesson.id &&
                      !isLessonCompleted(lesson, tutorial_completion),
                  }),
                }}
                className={clsx(
                  classes.lessonButton,
                  {
                    [classes.outlined]:
                      selectedLesson.id === lesson.id &&
                      isLessonCompleted(lesson, tutorial_completion),
                  },
                  {
                    [classes.semiTransparent]:
                      selectedLesson.id === lesson.id &&
                      !isLessonCompleted(lesson, tutorial_completion),
                  },
                )}
                color={
                  isLessonCompleted(lesson, tutorial_completion)
                    ? 'primary'
                    : 'default'
                }
                onClick={() => goToLesson(section.id, lesson.id)}
                variant="contained"
              />
            </ToolTip>
          );
        })}
        <EmojiEventsIcon
          className={classes.icon}
          color={sectionCompleted ? 'primary' : 'disabled'}
          fontSize="medium"
        />
      </div>
      <FeatureListProvider>
        {(featureList: FeatureList) => {
          const shouldDisplayUpsellInfos = isUpsellNotSubscribed(
            selectedLesson,
            featureList,
          );

          return (
            <>
              {shouldDisplayUpsellInfos && (
                <div className={classes.upsellInfoContainer}>
                  <InfoBox
                    className={classes.borderRadiusAdjustment}
                    content={t('lessonHeader.warning')}
                    variant="outlined"
                  />
                  <Button onClick={handleKnowMore} variant="outlined">
                    <HelpOutlinedIcon className={classes.iconLeft} />
                    {t('platformBilling:upsellPackage.knowMore')}
                  </Button>
                </div>
              )}
            </>
          );
        }}
      </FeatureListProvider>
    </Paper>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: theme.spacing(4),
    paddingBottom: theme.spacing(3),
    gap: theme.spacing(1),
  },
  skeleton: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  box: {
    borderRadius: theme.spacing(1),
    width: theme.spacing(5.5),
    height: theme.spacing(5.5),
    minWidth: theme.spacing(5.5),
    minHeight: theme.spacing(5.5),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPrimary: {
    fill: theme.palette.primary.main,
  },
  iconDisabled: {
    fill: theme.palette.text.disabled,
  },
  boxGrey: {
    backgroundColor: theme.palette.action.selected,
  },

  boxPrimary: {
    backgroundColor: chroma(theme.palette.primary.main).alpha(0.2).hex(),
  },
  textContainer: {
    wordBreak: 'break-word',
  },

  firstRow: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
    justifyContent: 'start',
    width: '100%',
  },

  secondRow: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
    width: '100%',
    overflowX: 'auto',
    overflowY: 'hidden',
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      gap: theme.spacing(1),
    },
  },
  icon: {
    marginTop: theme.spacing(1),
  },
  outlined: {
    outline: `1px solid ${theme.palette.primary.main}`,
    outlineOffset: theme.spacing(0.5),
  },
  lessonButton: {
    overflowY: 'visible',
    width: theme.spacing(12.5),
    height: theme.spacing(3),
    marginTop: theme.spacing(1),
  },
  semiTransparent: {
    backgroundColor: chroma(theme.palette.primary.main).alpha(0.5).hex(),
  },
  rootButton: {
    minWidth: theme.spacing(2.5),
    borderRadius: theme.spacing(1),
  },
  overrideMuiLessonCompletedButtonRootHoverMobile: {
    [theme.breakpoints.down('sm')]: {
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
      },
    },
  },
  overrideMuiLessonSelectedButtonRootHoverMobile: {
    [theme.breakpoints.down('sm')]: {
      '&:hover': {
        backgroundColor: chroma(theme.palette.primary.main).alpha(0.5).hex(),
      },
    },
  },
  chipAddOn: {
    display: 'flex',
    borderRadius: theme.spacing(0.5),
    justifyContent: 'center',
    backgroundColor: chroma(theme.palette.info.main).alpha(0.1).hex(),
    color: theme.palette.info.main,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
  upsellInfoContainer: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing(2),
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(3),
  },
  borderRadiusAdjustment: {
    borderRadius: theme.spacing(1),
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
}));

export default TutorialLessonHeader;
