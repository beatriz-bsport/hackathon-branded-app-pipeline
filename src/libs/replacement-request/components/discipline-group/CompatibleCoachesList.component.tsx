// @ts-nocheck
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import makeStyles from '@material-ui/core/styles/makeStyles';
import Collapse from '@material-ui/core/Collapse';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import CompatibleCoachesListItem from '#libs/replacement-request/components/discipline-group/CompatibleCoachesListItem.component';

import { MetaActivity } from '#libs/meta-activity/types';
import { SCT } from '#libs/category/types';
import { CompatibleCoachesByCategory } from '../../types';

type Props = {
  activities: MetaActivity[];
  workshops: MetaActivity[];
  SCTs: SCT[];
  compatibleCoachesByCategory: CompatibleCoachesByCategory;
};

export const CompatibleCoachesList: React.FC<Props> = ({
  activities,
  workshops,
  SCTs,
  compatibleCoachesByCategory,
}) => {
  const { t } = useTranslation('replacement');

  const classes = useStyles();

  const [activitiesOpen, setActivityOpen] = useState(true);
  const [workshopsOpen, setWorkshopsOpen] = useState(true);
  const [SCTsOpen, setSCTsOpen] = useState(true);

  const handleActivitiesOpen = useCallback(
    () => setActivityOpen(!activitiesOpen),
    [setActivityOpen, activitiesOpen],
  );
  const handleWorkshopsOpen = useCallback(
    () => setWorkshopsOpen(!workshopsOpen),
    [setWorkshopsOpen, workshopsOpen],
  );
  const handleSCTsOpen = useCallback(
    () => setSCTsOpen(!SCTsOpen),
    [setSCTsOpen, SCTsOpen],
  );

  return (
    <>
      <div className={classes.collapseFrame}>
        <ButtonBase
          className={classes.buttonTitle}
          onClick={handleActivitiesOpen}
        >
          {activitiesOpen ? (
            <ExpandLessIcon className={classes.expandButton} />
          ) : (
            <ExpandMoreIcon className={classes.expandButton} />
          )}
          <Typography variant="h6">
            {t('compatibleCoaches.activities')}
          </Typography>
        </ButtonBase>
        <Collapse in={activitiesOpen}>
          {activities.map((activity) => (
            <CompatibleCoachesListItem
              key={activity.id}
              name={activity.name}
              nextSlot={activity.next_slot}
              logo={activity.cover_main}
              alt={activity.alt_cover_main}
              color={activity.color}
              categoryId={activity.parent_category}
              compatibleTeachers={
                compatibleCoachesByCategory.activities[activity.id] ??
                compatibleCoachesByCategory.activities.all
              }
            />
          ))}
        </Collapse>
      </div>

      <div className={classes.collapseFrame}>
        <ButtonBase
          className={classes.buttonTitle}
          onClick={handleWorkshopsOpen}
        >
          {workshopsOpen ? (
            <ExpandLessIcon className={classes.expandButton} />
          ) : (
            <ExpandMoreIcon className={classes.expandButton} />
          )}
          <Typography variant="h6">
            {t('compatibleCoaches.workshops')}
          </Typography>
        </ButtonBase>
        <Collapse in={workshopsOpen}>
          {workshops.map((workshop) => (
            <CompatibleCoachesListItem
              key={workshop.id}
              name={workshop.name}
              nextSlot={workshop.next_slot}
              logo={workshop.cover_main}
              alt={workshop.alt_cover_main}
              color={workshop.color}
              categoryId={workshop.parent_category}
              compatibleTeachers={
                compatibleCoachesByCategory.workshops[workshop.id] ??
                compatibleCoachesByCategory.workshops.all
              }
            />
          ))}
        </Collapse>
      </div>

      <div className={classes.collapseFrame}>
        <ButtonBase className={classes.buttonTitle} onClick={handleSCTsOpen}>
          {SCTsOpen ? (
            <ExpandLessIcon className={classes.expandButton} />
          ) : (
            <ExpandMoreIcon className={classes.expandButton} />
          )}
          <Typography variant="h6">
            {t('compatibleCoaches.categories')}
          </Typography>
        </ButtonBase>
        <Collapse in={SCTsOpen}>
          {SCTs.map((category) => (
            <CompatibleCoachesListItem
              key={category.id}
              name={category.name}
              categoryId={category.SCS.id}
              alt={category.name}
              compatibleTeachers={
                compatibleCoachesByCategory.SCTs[category.id] ??
                compatibleCoachesByCategory.SCTs.all
              }
            />
          ))}
        </Collapse>
      </div>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  collapseFrame: {
    marginTop: theme.spacing(3),
    border: `solid 2px ${theme.palette.grey[100]}`,
    borderRadius: theme.spacing(1),
    paddingLeft: theme.spacing(1),
  },
  buttonTitle: {
    [theme.breakpoints.down('xs')]: {
      marginLeft: theme.spacing(2),
    },
  },
  expandButton: { marginRight: theme.spacing(1) },
}));

export default CompatibleCoachesList;
