import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import PlaceIcon from '@material-ui/icons/Place';
import { MAX_DISPLAY } from '#libs/communication-v2/constants';

import CustomAvatarGroup from '#components/CustomAvatarGroup.component';

import { DisciplineGroup } from '#libs/replacement-request/types';
import { Coach } from '#libs/associated-coach/types';
import { Establishment, EstablishmentGroup } from '#libs/establishment/types';
import { MultilocationChoice } from '#libs/replacement-request/constants';

type Props = {
  disciplineGroup: DisciplineGroup<
    number,
    number,
    number,
    Establishment,
    EstablishmentGroup,
    Coach
  >;
  handleDelete: (
    disciplineGroup: DisciplineGroup<
      number,
      number,
      number,
      Establishment,
      EstablishmentGroup,
      Coach
    >,
  ) => void;
  handleEdit: (
    disciplineGroup: DisciplineGroup<
      number,
      number,
      number,
      Establishment,
      EstablishmentGroup,
      Coach
    >,
  ) => void;
};

const listSumUp = (items: any[], all: boolean) => {
  if (all) return '';

  return items.map((i) => i.name).join(', ');
};

const listSumUpEstablishments = (
  items: Establishment[],
  displayAll: string,
) => {
  if (items.length === 0) return displayAll;
  return items.map((establishment) => establishment.title).join(', ');
};

const listSumUpEstablishmentGroups = (
  items: EstablishmentGroup[],
  displayAll: string,
) => {
  if (items.length === 0) return displayAll;
  return items.map((establishmentGroup) => establishmentGroup.name).join(', ');
};

export const DisciplineGroupListItem: React.FC<Props> = ({
  disciplineGroup,
  handleDelete,
  handleEdit,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('replacement');

  const onDelete = useCallback(
    () => handleDelete(disciplineGroup),
    [handleDelete, disciplineGroup],
  );
  const onEdit = useCallback(
    () => handleEdit(disciplineGroup),
    [handleEdit, disciplineGroup],
  );

  const multiLocationChoice =
    disciplineGroup.establishment_groups.length !== 0
      ? MultilocationChoice.Locations
      : MultilocationChoice.Establishments;

  const allImageLinks =
    disciplineGroup.associated_coaches.map((coach) => coach.photo) || [];
  const slicedImageLinks =
    allImageLinks.length > MAX_DISPLAY
      ? allImageLinks.slice(0, MAX_DISPLAY)
      : allImageLinks;

  return (
    <ListItem className={classes.container}>
      <div className={classes.leftContainer}>
        <Typography variant="subtitle1">{disciplineGroup.name}</Typography>
        <div className={classes.detailsContainer}>
          <Typography variant="body2">
            {t('disciplineGroup.activities', {
              number: !disciplineGroup.all_activities
                ? disciplineGroup.meta_activities.length
                : t('disciplineGroup.all'),
            })}
          </Typography>
          <Typography variant="body2" className={classes.detailsList}>
            {listSumUp(
              disciplineGroup.meta_activities,
              disciplineGroup.all_activities,
            )}
          </Typography>
        </div>
        <div className={classes.detailsContainer}>
          <Typography variant="body2">
            {t('disciplineGroup.workshops', {
              number: !disciplineGroup.all_workshops
                ? disciplineGroup.workshops.length
                : t('disciplineGroup.all'),
            })}
          </Typography>
          <Typography variant="body2" className={classes.detailsList}>
            {listSumUp(
              disciplineGroup.workshops,
              disciplineGroup.all_workshops,
            )}
          </Typography>
        </div>
        <div className={classes.detailsContainer}>
          <Typography variant="body2">
            {t('disciplineGroup.categories', {
              number: !disciplineGroup.all_categories
                ? disciplineGroup.categories.length
                : t('disciplineGroup.all'),
            })}
          </Typography>
          <Typography variant="body2" className={classes.detailsList}>
            {listSumUp(
              disciplineGroup.categories,
              disciplineGroup.all_categories,
            )}
          </Typography>
        </div>
      </div>
      <div className={classes.rightContainer}>
        <div className={classes.buttons}>
          <IconButton onClick={onEdit}>
            <Edit color="primary" />
          </IconButton>
          <IconButton onClick={onDelete}>
            <Delete />
          </IconButton>
        </div>
        <div className={classes.coachInfos}>
          <CustomAvatarGroup imgLinks={slicedImageLinks} />
          <Typography>
            {t('disciplineGroup.coaches', {
              count: disciplineGroup.associated_coaches.length,
            })}
          </Typography>
        </div>
        <div className={classes.establishmentInfos}>
          <PlaceIcon className={classes.establishmentIcon} />
          <Typography
            variant="body2"
            className={classes.establishmentDetailsList}
          >
            {multiLocationChoice === MultilocationChoice.Locations
              ? listSumUpEstablishmentGroups(
                  disciplineGroup.establishment_groups,
                  t('disciplineGroup.form.allEstablishments'),
                )
              : listSumUpEstablishments(
                  disciplineGroup.establishments,
                  t('disciplineGroup.form.allEstablishments'),
                )}
          </Typography>
        </div>
      </div>
    </ListItem>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  },
  leftContainer: {
    flex: '0 0 60%',
    maxWidth: '60%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  rightContainer: {
    display: 'inline-flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: theme.spacing(1),
    flex: '0 0 40%',
    maxWidth: '40%',
    overflow: 'hidden',
  },
  buttons: {
    display: 'table',
    position: 'relative',
    right: 0,
    gap: theme.spacing(1),
  },
  coachInfos: {
    display: 'flex',
    position: 'relative',
    right: 0,
    alignItems: 'center',
    gap: theme.spacing(1),
    whiteSpace: 'nowrap',
  },
  establishmentInfos: {
    display: 'flex',
    right: 0,
    alignItems: 'center',
    whiteSpace: 'nowrap',
    color: theme.palette.common.black,
    maxWidth: '90%',
  },
  establishmentIcon: {
    color: theme.palette.grey[600],
  },
  detailsContainer: {
    display: 'flex',
    whiteSpace: 'nowrap',
  },
  detailsList: {
    color: theme.palette.grey[600],
    marginLeft: theme.spacing(1),
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  establishmentDetailsList: {
    marginLeft: theme.spacing(1),
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
}));

export default DisciplineGroupListItem;
