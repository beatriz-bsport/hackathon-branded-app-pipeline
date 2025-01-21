import React from 'react';
import chroma from 'chroma-js';
import { DateTime } from 'luxon';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import {
  ButtonBase,
  Divider,
  IconButton,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DeleteIcon from '@material-ui/icons/Delete';

// @ts-expect-error
import { MetaActivity, OffersGroup } from '#src/libs/meta-activity/types';
import { Offer } from '#src/libs/offer/types';
import ReccurenceDisplay from './RecurrenceDisplay.component';
import { getTextColorFromRGB } from '../../../utils/color';
import { formatISOStringAsTime } from '../../../utils/datetime';

type Props = {
  group: OffersGroup;
  metaActivity: MetaActivity;
  offers: Offer[];
  offerSelected?: number;
  onEdit?: (group: OffersGroup<Offer>) => void;
  onCopy?: (group: OffersGroup<Offer>) => void;
  onDelete?: (group: OffersGroup<Offer>) => void;
  onSelect: (id: number) => void;
};

export const GroupCard: React.FC<Props> = ({
  group,
  metaActivity = {},
  offers,
  offerSelected,
  onEdit,
  onCopy,
  onDelete,
  onSelect,
}) => {
  const classes = useStyles();
  const { t } = useTranslation(['metaActivity']);

  const handleEdit = () => {
    onEdit({
      ...group,
      offers,
    });
  };

  const handleCopy = () => {
    onCopy({
      ...group,
      offers,
    });
  };

  const handleDelete = () => {
    onDelete({
      ...group,
      offers,
    });
  };

  const handleSelect = (offerId: number) => () => {
    onSelect(offerId);
  };

  const metaActivityColor =
    metaActivity.color && metaActivity.color !== ''
      ? metaActivity.color
      : '#ccc';

  const capitalizeFirstLetter = (value: string) =>
    value.replace(/^./, value[0].toUpperCase());

  return (
    <Paper className={classes.paper}>
      <div className={classes.header}>
        <div className={classes.topRow}>
          <Typography>{group.name}</Typography>
          <div>
            {onEdit && (
              <IconButton color="primary" onClick={handleEdit}>
                <EditIcon />
              </IconButton>
            )}
            {onCopy && (
              <IconButton color="primary" onClick={handleCopy}>
                <FileCopyIcon />
              </IconButton>
            )}
            {onDelete && (
              <IconButton onClick={handleDelete}>
                <DeleteIcon />
              </IconButton>
            )}
          </div>
        </div>
        <div className={classes.bottomRow}>
          <div
            className={classes.chip}
            style={{
              backgroundColor: metaActivityColor,
              color: getTextColorFromRGB(chroma(metaActivityColor).rgb()),
            }}
          >
            {metaActivity.name}
          </div>
          <ReccurenceDisplay
            withoutUntil
            recurrenceRule={group.recurrence_rule}
          />
        </div>
      </div>
      <Divider
        className={classes.divider}
        style={{ backgroundColor: metaActivityColor }}
      />
      <div className={classes.offerList}>
        {offers.map((offer) => {
          if (!offer) return null;
          const nbBookings = offer.validated_booking_count ?? 0;
          // @ts-expect-error
          const cancelledOffer = (offer.bookings?.length ?? 0) - nbBookings;

          return (
            <ButtonBase
              key={offer.id}
              className={clsx(classes.offerItem, {
                [classes.isSelected]: offerSelected === offer.id,
                [classes.isDisabled]: !offer.available,
              })}
              onClick={handleSelect(offer.id)}
            >
              <div className={classes.offerItemTopRow}>
                <div
                  style={{
                    maxWidth: '50%',
                    flex: 1,
                    minHeight: 1,
                  }}
                >
                  {cancelledOffer > 0 && (
                    <div className={classes.cancel}>
                      {t('cancelledOffers', { count: cancelledOffer })}
                    </div>
                  )}
                </div>
                <div>
                  <Typography color="textSecondary" variant="caption">
                    {formatISOStringAsTime(offer.date_start)}
                  </Typography>
                </div>
              </div>
              <div>
                <span className={classes.huge}>{nbBookings}</span>
                {`/ ${offer.effectif}`}
              </div>
              <div>
                <Typography color="primary">
                  {capitalizeFirstLetter(
                    DateTime.fromISO(offer.date_start).toFormat('ccc dd LLL'),
                  )}
                </Typography>
              </div>
            </ButtonBase>
          );
        })}
      </div>
    </Paper>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    overflow: 'hidden',
  },
  header: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  icon: {
    height: theme.spacing(2),
  },
  divider: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  offerList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: 1,
    paddingLeft: 1,
    paddingRight: 1,
    marginTop: 1,
    outlineColor: '#fff',
    outlineWidth: 1,
    outlineStyle: 'solid',
  },
  chip: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    borderRadius: 4,
  },
  cancel: {
    padding: theme.spacing(1) / 2,
    borderRadius: 2,
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.dark,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  offerItem: {
    cursor: 'pointer',
    outlineColor: theme.palette.grey[300],
    outlineWidth: 1,
    outlineStyle: 'solid',
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  offerItemTopRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: theme.spacing(2),
  },
  huge: {
    fontSize: 32,
  },
  isSelected: {
    backgroundColor: theme.palette.grey[300],
  },
  isDisabled: {
    backgroundColor: chroma(theme.palette.error.main).alpha(0.2).hex(),
  },
}));

export default React.memo(GroupCard);
