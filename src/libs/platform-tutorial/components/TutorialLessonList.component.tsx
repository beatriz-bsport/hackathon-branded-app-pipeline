import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ShareIcon from '@material-ui/icons/Share';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import chroma from 'chroma-js';
import { Tooltip } from '@material-ui/core';
import {
  TutorialCompletion,
  TutorialLesson,
} from '#libs/platform-tutorial/types';
import { isLessonCompleted, isLessonViewed } from '../utils';

export type Props = {
  lessons: Array<TutorialLesson>;
  goToLesson: (sectionId: number | string, lessonId: number | string) => void;
  shareLesson: (lesson: TutorialLesson) => void;
  tutorial_completion: TutorialCompletion;
};

const LessonStatusChips: React.FC<{
  lesson: TutorialLesson;
  tutorial_completion: TutorialCompletion;
}> = ({ lesson, tutorial_completion }) => {
  const classes = useStyles();
  const { t } = useTranslation('tutorial');
  return (
    <div className={classes.flex}>
      {!isLessonViewed(lesson, tutorial_completion) && (
        <div className={classes.chipNew}>{t('lessonList.new')}</div>
      )}
    </div>
  );
};

const TutorialLessonList: React.FC<Props> = (props: Props) => {
  const { lessons, goToLesson, shareLesson, tutorial_completion } = props;
  const classes = useStyles();
  const [moreMenuOpen, setMoreMenuopen] = useState<
    EventTarget & HTMLButtonElement
  >(null);
  const [selectedLessonOpenMenu, setSelectedLessonOpenMenu] =
    useState<TutorialLesson>(null);
  const { t } = useTranslation('tutorial');

  const onCloseMenu = () => setMoreMenuopen(null);

  if (!lessons?.length) {
    return <></>;
  }

  return (
    <>
      <List component="nav" className={classes.root}>
        {lessons.map((lesson) => {
          return (
            <ListItem
              key={`lesson_${lesson.id}`}
              button
              onClick={(e) => {
                e.stopPropagation();
                goToLesson(lesson.section, lesson.id);
              }}
              className={classes.listItem}
            >
              <CheckCircleOutlineIcon
                color="disabled"
                className={classNames({
                  [classes.iconGreen]: isLessonCompleted(
                    lesson,
                    tutorial_completion,
                  ),
                })}
              />
              <div className={classes.growSection}>
                <Typography variant="body1" className={classes.sectionTitle}>
                  {lesson.translated_name}
                </Typography>
                <LessonStatusChips
                  lesson={lesson}
                  tutorial_completion={tutorial_completion}
                />
              </div>
              <div className={classes.rowEnd}>
                <Hidden xsDown>
                  <IconButton
                    color="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      shareLesson(lesson);
                    }}
                  >
                    <Tooltip title={t('lessonList.shareLesson')}>
                      <ShareIcon />
                    </Tooltip>
                  </IconButton>
                  <Button
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToLesson(lesson.section, lesson.id);
                    }}
                  >
                    <div className={classes.menuItem}>
                      <PlayArrowIcon />
                      <Typography>{t('lessonList.start')}</Typography>
                    </div>
                  </Button>
                </Hidden>
                <Hidden smUp>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setMoreMenuopen(e.currentTarget);
                      setSelectedLessonOpenMenu(lesson);
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Hidden>

                <div />
              </div>
            </ListItem>
          );
        })}
      </List>
      <Menu
        anchorEl={moreMenuOpen}
        keepMounted
        open={Boolean(moreMenuOpen)}
        onClick={(e) => e.stopPropagation()}
        onClose={onCloseMenu}
      >
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            setMoreMenuopen(null);
            goToLesson(
              selectedLessonOpenMenu.section,
              selectedLessonOpenMenu.id,
            );
          }}
          className={classNames(classes.menuItem, classes.primary)}
        >
          <PlayArrowIcon />
          <Typography>{t('lessonList.start')}</Typography>
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            setMoreMenuopen(null);
            shareLesson(selectedLessonOpenMenu);
          }}
          className={classNames(classes.menuItem, classes.secondary)}
        >
          <Tooltip title={t('lessonList.shareLesson')}>
            <ShareIcon />
          </Tooltip>
          <Typography>{t('lessonList.share')}</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  listItem: {
    paddingLeft: theme.spacing(8),
    display: 'flex',
    justifyContent: 'start',
    gap: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      paddingLeft: theme.spacing(4),
    },
  },
  growSection: {
    display: 'flex',
    gap: theme.spacing(1),
    justifyContent: 'start',
    alignItems: 'center',
    flexGrow: 1,
    minWidth: theme.spacing(20),
    width: theme.spacing(20),
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    [theme.breakpoints.down('xs')]: {
      minWidth: theme.spacing(16),
      width: theme.spacing(16),
    },
  },
  sectionTitle: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },

  rowEnd: {
    marginLeft: 'auto',
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'center',
  },
  menuItem: {
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'center',
  },
  iconGreen: { fill: 'green' },
  primary: {
    color: theme.palette.primary.main,
  },
  secondary: {
    color: theme.palette.secondary.main,
  },
  chipNew: {
    display: 'flex',
    borderRadius: theme.spacing(0.5),
    backgroundColor: chroma(theme.palette.primary.main).alpha(0.1).hex(),
    color: theme.palette.primary.main,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
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
  flex: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'initial',
    gap: theme.spacing(1),
  },
}));

export default TutorialLessonList;
