import React from 'react';
import chroma from 'chroma-js';
import classNames from 'classnames';
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

import { isLessonCompleted, isUpsellNotSubscribed } from '../utils';

import FeatureListProvider from '#libs/company/hocs/feature-list-provider.hoc';
import ToolTip from '#components/Tooltip.component';
import MuiIcon from '#components/MuiIcon.component';
import LessonStatusChips from './TutorialLessonStatusChip.component';
import InfoBox from '#components/box/InfoBox.component';

import { FeatureList } from '#libs/company/types';
import { TutorialCompletion, TutorialLesson, TutorialSection } from '../types';

export type Props = {
  selectedLesson: TutorialLesson;
  section: TutorialSection;
  goToLesson: (sectionId: number | string, lessonId: number | string) => void;
  tutorial_completion: TutorialCompletion;
  onKnowMore: (id: number) => void;
};

const TutorialLessonHeader: React.FC<Props> = ({
  selectedLesson,
  section,
  goToLesson,
  tutorial_completion,
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
      <Paper elevation={0} className={classes.paper}>
        <div className={classNames(classes.secondRow, classes.skeleton)}>
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={`skeleton_${idx}`} style={{ width: '100%' }}>
              <Skeleton
                animation="wave"
                width="80%"
                variant="text"
                height={30}
              />
            </div>
          ))}
        </div>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} className={classes.paper}>
      <div className={classes.firstRow}>
        <div
          className={classNames(
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
            icon={section?.icon}
            defaultIcon="BusinessCenter"
            className={classNames(
              {
                [classes.iconPrimary]: sectionCompleted,
              },
              {
                [classes.iconDisabled]: !sectionCompleted,
              },
            )}
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
              title={lesson?.translated_name}
              placement="bottom"
            >
              <Button
                disableElevation
                className={classNames(
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
                classes={{
                  root: classNames(classes.rootButton, {
                    [classes.overrideMuiLessonCompletedButtonRootHoverMobile]:
                      isLessonCompleted(lesson, tutorial_completion),
                    [classes.overrideMuiLessonSelectedButtonRootHoverMobile]:
                      selectedLesson.id === lesson.id &&
                      !isLessonCompleted(lesson, tutorial_completion),
                  }),
                }}
                variant="contained"
                color={
                  isLessonCompleted(lesson, tutorial_completion)
                    ? 'primary'
                    : 'default'
                }
                onClick={() => goToLesson(section.id, lesson.id)}
              />
            </ToolTip>
          );
        })}
        <EmojiEventsIcon
          fontSize="medium"
          className={classes.icon}
          color={sectionCompleted ? 'primary' : 'disabled'}
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
                    content={t('lessonHeader.warning')}
                    className={classes.borderRadiusAdjustment}
                    variant="outlined"
                  />
                  <Button variant="outlined" onClick={handleKnowMore}>
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
