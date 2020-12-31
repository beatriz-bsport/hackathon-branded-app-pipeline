import React, { useCallback } from 'react';
import {
  Avatar,
  Fade,
  Typography,
  makeStyles,
  ButtonBase,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import {
  PrivateCoach,
  PrivateService,
  PrivateSlot,
} from '../../../../libs/private-service/types';

type Props = {
  privateService: PrivateService,
  privateSlot: PrivateSlot,
  selectedCoaches: PrivateCoach[],
  onSelect: (slot: PrivateCoach) => void,
};

const CoachSelector: React.FC<Props> = (props) => {
  const isCoachSelected = useCallback(
    (coach) => {
      return (
        props.selectedCoaches &&
        props.selectedCoaches.length &&
        props.selectedCoaches.find((c) => c.id === coach.id)
      );
    },
    [props.selectedCoaches]
  );

  const { t } = useTranslation('privateService');
  const classes = useStyles();

  return (
    <Fade in timeout={500}>
      <div className={classes.container}>
        <Typography className={classes.titleMargin} variant="h5">
          {t('slotSearcher.coach')}
        </Typography>
        <div className={classes.container2}>
          {props.privateService.coaches.map((coach: PrivateCoach) => {
            return (
              <ButtonBase
                key={coach.id}
                className={classNames({
                  [classes.item]: true,
                  [classes.itemSelected]: isCoachSelected(coach),
                })}
                onClick={() => props.onSelect(coach)}
                disabled={!props.privateSlot}
              >
                <div className={classes.itemInner}>
                  <Avatar src={coach.photo} alt={coach.name} />
                  <Typography className={classes.label} variant="subtitle2">
                    {coach.name}
                  </Typography>
                </div>
                {!props.privateSlot && <div className={classes.mask} />}
              </ButtonBase>
            );
          })}
        </div>
      </div>
    </Fade>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  container2: {
    display: 'flex',
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    margin: theme.spacing(1),
    borderRadius: 50,
    backgroundColor: 'white',
    fontWeight: 500,
    overflow: 'hidden',
  },
  itemInner: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing(0.5),
    paddingRight: theme.spacing(2),
  },
  itemSelected: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
  },
  label: {
    marginLeft: theme.spacing(1),
  },
  mask: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#CCCCCC88',
  },
  titleMargin: {
    marginLeft: theme.spacing(1),
  },
}));

export default CoachSelector;
