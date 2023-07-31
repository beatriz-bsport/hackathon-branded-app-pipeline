import React from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ListItemText from '@material-ui/core/ListItemText';
import { alpha } from '@material-ui/core/styles';

import SPORTS from '@bsport/common/lib/master-data/sports';
import { formatAsTime } from '../../../../utils/datetime';

type Props = {
  name: string;
  compatibleTeachers: number;
  nextSlot?: string;
  logo?: string;
  alt?: string;
  color?: string;
  categoryId: number;
};

export const CompatibleCoachesListItem: React.FC<Props> = ({
  name,
  compatibleTeachers,
  nextSlot,
  logo,
  alt,
  color,
  categoryId,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('replacement');
  const sport = SPORTS?.filter((s) => s.id === categoryId)[0];

  return (
    <ListItem>
      {color ? (
        <div className={classes.colorChip} style={{ backgroundColor: color }} />
      ) : null}
      <ListItemIcon>
        {logo || sport?.icon ? (
          <img
            src={logo || sport?.icon}
            alt={alt || ''}
            height={56}
            width={56}
            className={classes.image}
          />
        ) : null}
      </ListItemIcon>
      <ListItemText
        primary={name}
        secondary={
          nextSlot
            ? t('compatibleCoaches.nextSlot', {
                date: moment(nextSlot).format('L'),
                hour: formatAsTime(nextSlot),
                interpolation: { escapeValue: false },
              })
            : null
        }
      />
      <div className={classes.chip}>
        {t('compatibleCoaches.compatibleCoaches', {
          count: compatibleTeachers,
        })}
      </div>
    </ListItem>
  );
};

const useStyles = makeStyles((theme) => ({
  colorChip: {
    position: 'absolute',
    height: '75%',
    width: '10px',
    left: 0,
    top: '12.5%',
    borderRadius: `0 5px 5px 0`,
  },
  image: {
    objectFit: 'cover',
    borderRadius: theme.spacing(1),
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  chip: {
    padding: `${theme.spacing(0.25)}px ${theme.spacing(0.75)}px`,
    borderRadius: theme.spacing(0.5),
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    whiteSpace: 'nowrap',
  },
}));

export default CompatibleCoachesListItem;
