import React from 'react';

import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';

import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Avatar from '@material-ui/core/Avatar';
import { AvailabilityDetail } from '#libs/private-service/types';
import { formatAsTime } from '../../../../utils/datetime';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    borderWidth: '1px',
    borderBottomWidth: 0,
    borderStyle: 'solid',
    borderColor: theme.palette.grey[300],
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  resourceNameRow: {
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    marginRight: theme.spacing(1),
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  greyText: {
    color: theme.palette.grey[600],
  },
  slot: {
    marginTop: theme.spacing(1),
  },
  list: {
    margin: 'unset',
    paddingLeft: theme.spacing(3),
    '& li': {
      listStyleType: 'unset',
    },
  },
  first: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  last: {
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomWidth: '1px',
  },
}));

export type Props = AvailabilityDetail;
export const SlotDetailListItem: React.FC<Props> = ({
  name,
  photo,
  slots,
  resourceType,
  resourceId,
  isFirst,
  isLast,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('privateService');

  return (
    <div
      className={classNames(classes.container, classes.flexColumn, {
        [classes.first]: !!isFirst,
        [classes.last]: !!isLast,
      })}
    >
      <div className={classes.resourceNameRow}>
        <Avatar className={classes.avatar} src={photo} />
        <Typography variant="body2">{name}</Typography>
      </div>
      <div className={classes.flexColumn}>
        {resourceType === 'associated_coach' ? (
          <>
            {slots.map((slot) => (
              <div
                key={`${resourceType}-${resourceId}-${
                  slot.date_start
                }-${JSON.stringify(
                  slot.restriction_on_associated_establishments,
                )}`}
                className={classNames(classes.flexColumn, classes.slot)}
              >
                <Typography variant="body2">
                  {t('availabilitySlot.detail.slotBoundaries', {
                    date_start: formatAsTime(slot.date_start),
                    date_end: formatAsTime(slot.date_end),
                  })}
                </Typography>
                {slot.restriction_on_associated_establishments.length ? (
                  <ul className={classes.list}>
                    {slot.restriction_on_associated_establishments.map(
                      (establishmentName, i) => (
                        <li key={`${establishmentName}-${i}`}>
                          {establishmentName}
                        </li>
                      ),
                    )}
                  </ul>
                ) : (
                  <Typography className={classes.greyText} variant="body2">
                    {t('availabilitySlot.detail.availableEverywhere')}
                  </Typography>
                )}
              </div>
            ))}
          </>
        ) : (
          <>
            <div className={classNames(classes.flexColumn, classes.slot)}>
              <Typography variant="body2">
                {t('availabilitySlot.detail.openHours')}
              </Typography>
              <ul className={classes.list}>
                {slots.map((slot) => (
                  <li key={`${resourceType}-${resourceId}-${slot.date_start}`}>
                    {`${formatAsTime(slot.date_start)} - ${formatAsTime(
                      slot.date_end,
                    )}`}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default React.memo(SlotDetailListItem);
