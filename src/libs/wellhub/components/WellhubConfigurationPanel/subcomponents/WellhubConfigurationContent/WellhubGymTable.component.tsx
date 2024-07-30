import React from 'react';
import { useTranslation } from 'react-i18next';

import makeStyles from '@material-ui/core/styles/makeStyles';
import withStyles from '@material-ui/core/styles/withStyles';

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  Avatar,
  Chip,
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';

import type { WellhubGym } from '#src/libs/wellhub/types';

const CustomTableCell = React.memo(
  withStyles(() => ({
    root: {
      borderBottom: 'none',
      padding: 0,
    },
  }))(TableCell),
);

type Props = {
  wellhubGyms: WellhubGym[];
  wellhubLoading: boolean;
  deleteWellhubGym: (wellhubGym: WellhubGym) => void;
  editWellhubGym: (wellhubGym: WellhubGym) => void;
};

const WellhubGymTable: React.FC<Props> = ({
  wellhubGyms,
  wellhubLoading,
  deleteWellhubGym,
  editWellhubGym,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('partnership');

  const handleEditWellhubGym = React.useCallback(
    (wellhubGym: WellhubGym) =>
      (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        event.preventDefault();
        editWellhubGym(wellhubGym);
      },
    [editWellhubGym],
  );

  const handleDeleteWellhubGym = React.useCallback(
    (wellhubGym: WellhubGym) =>
      (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        event.preventDefault();
        deleteWellhubGym(wellhubGym);
      },
    [deleteWellhubGym],
  );

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            {t('wellhub.configuration.panel.content.table.column.unit')}
          </TableCell>
          <TableCell align="left">
            {t(
              'wellhub.configuration.panel.content.table.column.establishments',
            )}
          </TableCell>
          <TableCell />
        </TableRow>
      </TableHead>
      {wellhubLoading && (
        <TableRow>
          <CustomTableCell colSpan={3}>
            <LinearProgress />
          </CustomTableCell>
        </TableRow>
      )}
      <TableBody>
        {wellhubGyms?.map((wellhubGym) => (
          <TableRow key={wellhubGym.uuid}>
            <TableCell>
              <div className={classes.unitRow}>
                <Typography noWrap className={classes.gymName} variant="body1">
                  {wellhubGym.gym_name}
                </Typography>
                <Typography
                  noWrap
                  className={classes.gymId}
                  variant="subtitle2"
                >
                  {wellhubGym.gym_id}
                </Typography>
              </div>
            </TableCell>
            <TableCell>
              <div className={classes.establishmentsRow}>
                {wellhubGym.establishments &&
                  wellhubGym.establishments.map((establishment) => (
                    <Chip
                      key={establishment.id}
                      avatar={
                        <Avatar
                          alt={`${establishment.title}`}
                          src={`${establishment.cover}`}
                        />
                      }
                      color="default"
                      label={establishment.title}
                      variant="outlined"
                    />
                  ))}
              </div>
            </TableCell>
            <TableCell>
              <div className={classes.actionsRow}>
                <IconButton onClick={handleEditWellhubGym(wellhubGym)}>
                  <EditIcon color="primary" />
                </IconButton>
                <IconButton onClick={handleDeleteWellhubGym(wellhubGym)}>
                  <DeleteIcon className={classes.greyIcon} />
                </IconButton>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const useStyles = makeStyles((theme) => ({
  gymName: {
    color: theme.palette.common.black,
  },
  gymId: {
    color: theme.palette.text.disabled,
  },
  unitRow: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 200,
  },
  establishmentsRow: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
  },
  actionsRow: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  greyIcon: {
    color: theme.palette.grey[600],
  },
}));

export default React.memo(WellhubGymTable);
