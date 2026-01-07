import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import makeStyles from '@material-ui/core/styles/makeStyles';
import withStyles from '@material-ui/core/styles/withStyles';

import CopyExternalIdButton from '#src/libs/partnership/components/CopyExternalIdButton';
import {
  PartnershipDisplayConfig,
  PartnershipVenue,
} from '#src/libs/partnership/types';
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
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import RestartAltIcon from '#src/components/icons/RestartAltIcon.component';
import VenueStatusChip from '../VenueStatusChip.component';
import Tooltip from '#src/components/Tooltip.component';

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
  onActivateVenue?: (partnershipVenue: PartnershipVenue) => void;
  onDeleteVenue: (partnershipVenue: PartnershipVenue) => void;
  onEditVenue: (partnershipVenue: PartnershipVenue) => void;
};

const isVenueDeactivated = (venue: PartnershipVenue) =>
  !venue.active && !!venue.activated_at;

const PartnershipVenueTable: React.FC<Props> = ({
  displayConfig,
  partnershipVenues,
  loading,
  onActivateVenue,
  onDeleteVenue,
  onEditVenue,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('partnership');

  const venuesHaveStatus = useMemo(
    () => partnershipVenues.some((venue) => venue.active !== undefined),
    [partnershipVenues],
  );

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

  const onActivateVenueCallback = React.useCallback(
    (partnershipVenue: PartnershipVenue) =>
      (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        event.preventDefault();
        onActivateVenue(partnershipVenue);
      },
    [onActivateVenue],
  );

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            {t(
              `${displayConfig.partnershipIdentifier}.configuration.panel.content.table.column.externalId`,
            )}
          </TableCell>
          <TableCell align="left">
            {t(
              `${displayConfig.partnershipIdentifier}.configuration.panel.content.table.column.establishments`,
            )}
          </TableCell>
          {venuesHaveStatus && (
            <TableCell>
              {t(
                `${displayConfig.partnershipIdentifier}.configuration.panel.content.table.column.status`,
              )}
            </TableCell>
          )}
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
                <Typography noWrap className={classes.idTitle} variant="body1">
                  {partnershipVenue.external_name ||
                    partnershipVenue.external_id}
                  {displayConfig.showCopyIdToClipboard && (
                    <CopyExternalIdButton
                      externalId={partnershipVenue.external_id}
                      partnershipIdentifier={
                        displayConfig.partnershipIdentifier
                      }
                    />
                  )}
                </Typography>
                {partnershipVenue.external_name && (
                  <Typography
                    noWrap
                    className={classes.idSubtitle}
                    variant="subtitle2"
                  >
                    {partnershipVenue.external_id}
                  </Typography>
                )}
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
            {venuesHaveStatus && (
              <TableCell>
                <VenueStatusChip
                  activatedAt={partnershipVenue.activated_at}
                  active={partnershipVenue.active ?? false}
                  partnershipIdentifier={displayConfig.partnershipIdentifier}
                />
              </TableCell>
            )}
            <TableCell>
              <div className={classes.actionsRow}>
                {!isVenueDeactivated(partnershipVenue) || !onActivateVenue ? (
                  <>
                    <IconButton onClick={onEditVenueCallback(partnershipVenue)}>
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton
                      onClick={onDeleteVenueCallback(partnershipVenue)}
                    >
                      <DeleteIcon className={classes.greyIcon} />
                    </IconButton>
                  </>
                ) : (
                  <Tooltip
                    title={
                      <Typography>
                        {t(
                          `${displayConfig.partnershipIdentifier}.configuration.panel.content.table.action.reactivateTooltip`,
                        )}
                      </Typography>
                    }
                  >
                    <IconButton
                      onClick={onActivateVenueCallback(partnershipVenue)}
                    >
                      <RestartAltIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const useStyles = makeStyles((theme) => ({
  idTitle: {
    color: theme.palette.common.black,
  },
  idSubtitle: {
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
