import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line bsport/no-redux-in-component
import { connect } from 'react-redux';

import makeStyles from '@material-ui/core/styles/makeStyles';
import withStyles from '@material-ui/core/styles/withStyles';

import CopyIcon from '#src/components/icons/CopyIcon.component';
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
import CopyToClipboard from 'react-copy-to-clipboard';
import VenueStatusChip from '../VenueStatusChip.component';

import { snackbarSuccess } from '#src/libs/snackbar/actions';

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
  showSuccess: (message: string) => void;
};

const PartnershipVenueTable: React.FC<Props> = ({
  displayConfig,
  partnershipVenues,
  loading,
  onDeleteVenue,
  onEditVenue,
  showSuccess,
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
                    <CopyToClipboard
                      onCopy={() =>
                        showSuccess(
                          t(
                            `${displayConfig.partnershipIdentifier}.configuration.panel.content.table.copied_to_clipboard`,
                          ),
                        )
                      }
                      text={partnershipVenue.external_id}
                    >
                      <IconButton className={classes.copyIcon} size="small">
                        <CopyIcon fontSize="small" />
                      </IconButton>
                    </CopyToClipboard>
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
                  active={partnershipVenue.active ?? false}
                  partnershipIdentifier={displayConfig.partnershipIdentifier}
                />
              </TableCell>
            )}
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
  copyIcon: {
    color: theme.palette.common.black,
    marginLeft: theme.spacing(0.5),
  },
}));

export default React.memo(
  connect(null, {
    showSuccess: snackbarSuccess,
  })(PartnershipVenueTable),
);
