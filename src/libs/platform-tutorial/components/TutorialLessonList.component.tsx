import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ShareIcon from '@material-ui/icons/Share';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { Tooltip } from '@material-ui/core';

import {
  TutorialCompletion,
  TutorialLesson,
} from '#libs/platform-tutorial/types';
import { isLessonCompleted } from '../utils';

import LessonStatusChips from './TutorialLessonStatusChip.component';


export type Props = {
  lessons: Array<TutorialLesson>;
  goToLesson: (sectionId: number | string, lessonId: number | string) => void;
  shareLesson: (lesson: TutorialLesson) => void;
  tutorial_completion: TutorialCompletion;
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
      <List className={classes.root} component="nav">
        {lessons.map((lesson) => {
          return (
            <ListItem
              key={`lesson_${lesson.id}`}
              button
              className={classes.listItem}
              onClick={(e) => {
                e.stopPropagation();
                goToLesson(lesson.section, lesson.id);
              }}
            >
              <CheckCircleOutlineIcon
                className={classNames({
                  [classes.iconGreen]: isLessonCompleted(
                    lesson,
                    tutorial_completion,
                  ),
                })}
                color="disabled"
              />
              <div className={classes.growSection}>
                <Typography className={classes.sectionTitle} variant="body1">
                  {lesson.translated_name}
                </Typography>
                <LessonStatusChips
                  withToolTip
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
        keepMounted
        anchorEl={moreMenuOpen}
        onClick={(e) => e.stopPropagation()}
        onClose={onCloseMenu}
        open={Boolean(moreMenuOpen)}
      >
        <MenuItem
          className={classNames(classes.menuItem, classes.primary)}
          onClick={(e) => {
            e.stopPropagation();
            setMoreMenuopen(null);
            goToLesson(
              selectedLessonOpenMenu.section,
              selectedLessonOpenMenu.id,
            );
          }}
        >
          <PlayArrowIcon />
          <Typography>{t('lessonList.start')}</Typography>
        </MenuItem>
        <MenuItem
          className={classNames(classes.menuItem, classes.secondary)}
          onClick={(e) => {
            e.stopPropagation();
            setMoreMenuopen(null);
            shareLesson(selectedLessonOpenMenu);
          }}
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
}));

export default TutorialLessonList;
