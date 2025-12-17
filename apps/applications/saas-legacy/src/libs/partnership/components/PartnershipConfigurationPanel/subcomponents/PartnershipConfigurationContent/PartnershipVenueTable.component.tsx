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
import {
  PartnershipDisplayConfig,
  PartnershipVenue,
} from '#src/libs/partnership/types';

const CustomTableCell = React.memo(
  withStyles(() => ({
    root: {
      borderBottom: 'none',
      padding: 0,
    },
  }))(TableCell),
);

type Props = {
  displayConfig: PartnershipDisplayConfig;
  partnershipVenues: PartnershipVenue[];
  loading: boolean;
  onDeleteVenue: (partnershipVenue: PartnershipVenue) => void;
  onEditVenue: (partnershipVenue: PartnershipVenue) => void;
};

const PartnershipVenueTable: React.FC<Props> = ({
  displayConfig,
  partnershipVenues,
  loading,
  onDeleteVenue,
  onEditVenue,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('partnership');

  const onEditVenueCallback = React.useCallback(
    (partnershipVenue: PartnershipVenue) =>
      (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        event.preventDefault();
        onEditVenue(partnershipVenue);
      },
    [onEditVenue],
  );

  const onDeleteVenueCallback = React.useCallback(
    (partnershipVenue: PartnershipVenue) =>
      (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        event.preventDefault();
        onDeleteVenue(partnershipVenue);
      },
    [onDeleteVenue],
  );

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            {t(
              `${displayConfig.partnershipIdentifier}.configuration.panel.content.table.column.unit`,
            )}
          </TableCell>
          <TableCell align="left">
            {t(
              `${displayConfig.partnershipIdentifier}.configuration.panel.content.table.column.establishments`,
            )}
          </TableCell>
          <TableCell />
        </TableRow>
      </TableHead>
      {loading && (
        <TableRow>
          <CustomTableCell colSpan={3}>
            <LinearProgress />
          </CustomTableCell>
        </TableRow>
      )}
      <TableBody>
        {partnershipVenues?.map((partnershipVenue) => (
          <TableRow key={partnershipVenue.id}>
            <TableCell>
              <div className={classes.venueRow}>
                {partnershipVenue.external_name && (
                  <Typography
                    noWrap
                    className={classes.externalName}
                    variant="body1"
                  >
                    {partnershipVenue.external_name}
                  </Typography>
                )}
                <Typography
                  noWrap
                  className={classes.externalId}
                  variant="subtitle2"
                >
                  {partnershipVenue.external_id}
                </Typography>
              </div>
            </TableCell>
            <TableCell>
              <div className={classes.establishmentsRow}>
                {partnershipVenue.establishments &&
                  partnershipVenue.establishments.map((establishment) => (
                    <Chip
                      key={establishment.id}
                      avatar={
                        <Avatar
                          alt={establishment.title}
                          src={establishment.cover}
                        />
                      }
                      color="default"
                      label={establishment.title}
                      variant={establishment.disabled ? 'default' : 'outlined'}
                    />
                  ))}
              </div>
            </TableCell>
            <TableCell>
              <div className={classes.actionsRow}>
                <IconButton onClick={onEditVenueCallback(partnershipVenue)}>
                  <EditIcon color="primary" />
                </IconButton>
                <IconButton onClick={onDeleteVenueCallback(partnershipVenue)}>
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
  externalName: {
    color: theme.palette.common.black,
  },
  externalId: {
    color: theme.palette.text.disabled,
  },
  venueRow: {
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

export default React.memo(PartnershipVenueTable);
