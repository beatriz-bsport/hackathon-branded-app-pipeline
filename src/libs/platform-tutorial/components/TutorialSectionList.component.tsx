// @ts-nocheck
import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';

import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import chroma from 'chroma-js';
import Collapse from '@material-ui/core/Collapse';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import classNames from 'classnames';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ShareIcon from '@material-ui/icons/Share';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '@material-ui/core';
import {
  TutorialCompletion,
  TutorialLesson,
  TutorialSection,
} from '#libs/platform-tutorial/types';
import TutorialLessonList from '#libs/platform-tutorial/components/TutorialLessonList.component';
import FeatureListProvider from '#libs/company/hocs/feature-list-provider.hoc';
import { FeatureList } from '#libs/company/types';
import MuiIcon from '#components/MuiIcon.component';
import { isLessonCompleted, isLessonViewed } from '../utils';
import { hasUpsell } from '#libs/platform-billing/utils';
import ToolTip from '#components/Tooltip.component';

export type Props = {
  sections: Array<TutorialSection>;
  shareObject: (
    object: TutorialSection | TutorialLesson,
    isSection: boolean,
  ) => void;
  goToLesson: (sectionId: number, lessonId: number) => void;
  statistics: { [key: string | number]: Array<number> };
  defaultSelectedSectionId?: string;
  tutorial_completion: TutorialCompletion;
};

const LinearProgressFlexItem: React.FC<{
  section_statistics: Array<number>;
  mobile?: boolean;
}> = ({ section_statistics, mobile }) => {
  const classes = useStyles();
  return (
    <Grid
      container
      alignItems="center"
      className={classNames(
        classes.linearProgress,
        { [classes.xsDownHidden]: !mobile },
        classes.flex,
      )}
      justifyContent="flex-end"
      spacing={1}
    >
      <Grid item xs={12}>
        <LinearProgress
          classes={{ root: classes.progressBar }}
          color="primary"
          value={(section_statistics || [0, 0, 0])[2]}
          variant="determinate"
        />
      </Grid>
      <Typography color="primary" variant="subtitle1">
        {`${(section_statistics || [0, 0, 0])[0]}/${
          (section_statistics || [0, 0, 0])[1]
        }`}
      </Typography>
    </Grid>
  );
};

const SectionStatusChips: React.FC<{
  section: TutorialSection;
  tutorial_completion: TutorialCompletion;
}> = ({ section, tutorial_completion }) => {
  const classes = useStyles();
  const { t } = useTranslation('tutorial');
  const sectionViewed =
    section?.lessons?.filter(
      (lesson) => !isLessonViewed(lesson, tutorial_completion),
    )?.length === 0;
  return (
    <div className={classes.flex}>
      {!sectionViewed && (
        <div className={classes.chipBase}>{t('sectionList.new')}</div>
      )}
      <FeatureListProvider>
        {(featureList: FeatureList) => {
          const addonsLessons = section?.lessons?.filter(
            (lesson) => lesson.upsell_identifiers.length > 0,
          );
          const hasUpsellLesson = !addonsLessons.every(
            (lesson) =>
              featureList.upsell &&
              hasUpsell(featureList, lesson.upsell_identifiers[0]),
          );
          return (
            <>
              {hasUpsellLesson && (
                <ToolTip title={t('sectionList.missingUpsell')}>
                  <div
                    className={classNames(
                      classes.chipBase,
                      classes.contentCenter,
                      classes.colorInfo,
                    )}
                  >
                    {t('sectionList.addOn')}
                  </div>
                </ToolTip>
              )}
            </>
          );
        }}
      </FeatureListProvider>
    </div>
  );
};

const TutorialSectionList: React.FC<Props> = (props: Props) => {
  const {
    sections,
    shareObject,
    goToLesson,
    statistics,
    defaultSelectedSectionId,
    tutorial_completion,
  } = props;
  const classes = useStyles();
  const { t } = useTranslation('tutorial');
  const [openSection, setOpenSection] = useState<number | string | null>(
    parseInt(defaultSelectedSectionId) || null,
  );
  return (
    <List className={classes.root} component="nav">
      {!!sections &&
        sections?.length > 0 &&
        sections.map((section) => {
          const sectionCompleted =
            section?.lessons?.filter(
              (lesson) => !isLessonCompleted(lesson, tutorial_completion),
            )?.length === 0;
          const sectionStarted =
            section?.lessons?.filter((lesson) =>
              isLessonCompleted(lesson, tutorial_completion),
            )?.length > 0;
          return (
            <div
              key={`section_${section.id}`}
              className={classes.sectionContainer}
            >
              <ListItem
                button
                classes={{ root: classes.rootListItem }}
                className={classes.listItem}
                onClick={(e) => {
                  e.stopPropagation();

                  setOpenSection(
                    openSection === section.id ? null : section.id,
                  );
                }}
              >
                <div className={classes.row}>
                  <div className={classes.rowStart}>
                    <div
                      className={classNames(
                        classes.box,
                        {
                          [classes.boxPrimary]: sectionStarted,
                        },
                        {
                          [classes.boxGrey]: !sectionStarted,
                        },
                      )}
                    >
                      <MuiIcon
                        className={classNames(
                          {
                            [classes.iconPrimary]: sectionStarted,
                          },
                          {
                            [classes.iconDisabled]: !sectionStarted,
                          },
                        )}
                        defaultIcon="BusinessCenter"
                        icon={section?.icon}
                      />
                    </div>
                    <div className={classes.expandIcon}>
                      {openSection === section.id ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                    </div>
                    <div className={classes.growSection}>
                      <Typography className={classes.sectionTitle} variant="h5">
                        {section?.translated_name}
                      </Typography>
                      <CheckCircleOutlineIcon
                        className={classNames({
                          [classes.iconGreen]: sectionCompleted,
                        })}
                        color="disabled"
                      />
                      <div className={classes.xsDownHidden}>
                        <SectionStatusChips
                          section={section}
                          tutorial_completion={tutorial_completion}
                        />
                      </div>
                    </div>
                    <IconButton
                      className={classes.xsDownShareIcon}
                      color="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        shareObject(section, true);
                      }}
                    >
                      <Tooltip title={t('sectionList.shareSection')}>
                        <ShareIcon />
                      </Tooltip>
                    </IconButton>
                  </div>

                  <LinearProgressFlexItem
                    section_statistics={(statistics || {})[section.id]}
                  />
                  <div
                    className={classNames(
                      classes.shareIcon,
                      classes.xsDownHidden,
                    )}
                  >
                    <IconButton
                      color="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        shareObject(section, true);
                      }}
                    >
                      <Tooltip title={t('sectionList.shareSection')}>
                        <ShareIcon />
                      </Tooltip>
                    </IconButton>
                  </div>
                </div>
                <div className={classes.mobileSecondRow}>
                  <SectionStatusChips
                    section={section}
                    tutorial_completion={tutorial_completion}
                  />
                  <LinearProgressFlexItem
                    mobile
                    section_statistics={(statistics || {})[section.id]}
                  />
                </div>
              </ListItem>

              <Collapse in={openSection === section.id}>
                <Divider />
                <TutorialLessonList
                  goToLesson={goToLesson}
                  lessons={section?.lessons}
                  shareLesson={(lesson: TutorialLesson) =>
                    shareObject(lesson, false)
                  }
                  tutorial_completion={tutorial_completion}
                />
              </Collapse>
            </div>
          );
        })}
    </List>
  );
};

const useStyles = makeStyles<Theme>((theme) => ({
  root: {
    width: '100%',
  },
  sectionContainer: {
    marginBottom: theme.spacing(3),
    borderRadius: theme.spacing(1),
    overflow: 'hidden',
  },
  rootListItem: {
    padding: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      '&:hover': {
        backgroundColor: theme.palette.background.paper,
      },
    },
  },
  listItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    width: '100%',
  },
  row: {
    width: '100%',
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(2),
    display: 'flex',

    justifyContent: 'start',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      paddingLeft: theme.spacing(0),
    },
  },
  rowStart: {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',

    flexGrow: 1,
  },
  linearProgress: {
    marginLeft: 'auto',
    maxWidth: '20%',
    minWidth: '5%',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),

    [theme.breakpoints.down('xs')]: { maxWidth: '50%' },
  },
  expandIcon: {
    display: 'flex',
    [theme.breakpoints.up('sm')]: { marginRight: theme.spacing(1.5) },
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
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  iconPrimary: {
    fill: theme.palette.primary.main,
  },
  iconDisabled: {
    fill: theme.palette.text.disabled,
  },
  iconGreen: { fill: 'green' },
  boxPrimary: {
    backgroundColor: chroma(theme.palette.primary.main).alpha(0.2).hex(),
  },
  boxGrey: {
    backgroundColor: chroma('black').alpha(0.08).hex(),
  },
  box: {
    position: 'relative',
    borderRadius: theme.spacing(1),
    maxWidth: theme.spacing(6),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(1.5),
    flex: '1 0',
    marginRight: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      marginRight: theme.spacing(0.5),
      padding: theme.spacing(1),
    },
  },
  progressBar: {
    height: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
  },
  flex: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'initial',
    gap: theme.spacing(1),
  },

  mobileSecondRow: {
    width: '100%',
    display: 'flex',
    justifyContent: 'end',
    gap: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  shareIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
  },
  completionCount: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  xsDownShareIcon: {
    marginLeft: 'auto',
    paddingLeft: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  xsDownHidden: {
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  chipBase: {
    display: 'flex',
    borderRadius: theme.spacing(0.5),
    backgroundColor: chroma(theme.palette.primary.main).alpha(0.1).hex(),
    color: theme.palette.primary.main,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
  colorInfo: {
    color: theme.palette.info.main,
    backgroundColor: chroma(theme.palette.info.main).alpha(0.1).hex(),
  },
  contentCenter: {
    justifyContent: 'center',
  },
}));

export default TutorialSectionList;
