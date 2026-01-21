import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import makeStyles from '@material-ui/core/styles/makeStyles';
import withStyles from '@material-ui/core/styles/withStyles';

import CopyExternalIdButton from '#src/libs/partnership/components/CopyExternalIdButton';
import {
  PartnershipDisplayConfig,
  PartnershipAccount,
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
import AccountStatusChip from '../AccountStatusChip.component';
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
  partnershipAccounts: PartnershipAccount[];
  loading: boolean;
  onActivateAccount?: (partnershipAccount: PartnershipAccount) => void;
  onDeleteAccount: (partnershipAccount: PartnershipAccount) => void;
  onEditAccount: (partnershipAccount: PartnershipAccount) => void;
};

const isAccountDeactivated = (account: PartnershipAccount) =>
  !account.active && !!account.activated_at;

const PartnershipAccountTable: React.FC<Props> = ({
  displayConfig,
  partnershipAccounts,
  loading,
  onActivateAccount,
  onDeleteAccount,
  onEditAccount,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('partnership');

  const accountsHaveStatus = useMemo(
    () => partnershipAccounts.some((account) => account.active !== undefined),
    [partnershipAccounts],
  );

  const onEditAccountCallback = React.useCallback(
    (partnershipAccount: PartnershipAccount) =>
      (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        event.preventDefault();
        onEditAccount(partnershipAccount);
      },
    [onEditAccount],
  );

  const onDeleteAccountCallback = React.useCallback(
    (partnershipAccount: PartnershipAccount) =>
      (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        event.preventDefault();
        onDeleteAccount(partnershipAccount);
      },
    [onDeleteAccount],
  );

  const onActivateAccountCallback = React.useCallback(
    (partnershipAccount: PartnershipAccount) =>
      (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        event.preventDefault();
        onActivateAccount(partnershipAccount);
      },
    [onActivateAccount],
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
          {accountsHaveStatus && (
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
        {partnershipAccounts?.map((partnershipAccount) => (
          <TableRow key={partnershipAccount.id}>
            <TableCell>
              <div className={classes.accountRow}>
                <Typography noWrap className={classes.idTitle} variant="body1">
                  {partnershipAccount.external_name ||
                    partnershipAccount.external_id}
                  {displayConfig.showCopyIdToClipboard && (
                    <CopyExternalIdButton
                      externalId={partnershipAccount.external_id}
                      partnershipIdentifier={
                        displayConfig.partnershipIdentifier
                      }
                    />
                  )}
                </Typography>
                {partnershipAccount.external_name && (
                  <Typography
                    noWrap
                    className={classes.idSubtitle}
                    variant="subtitle2"
                  >
                    {partnershipAccount.external_id}
                  </Typography>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div className={classes.establishmentsRow}>
                {partnershipAccount.establishments &&
                  partnershipAccount.establishments.map((establishment) => (
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
            {accountsHaveStatus && (
              <TableCell>
                <AccountStatusChip
                  activatedAt={partnershipAccount.activated_at}
                  active={partnershipAccount.active ?? false}
                  partnershipIdentifier={displayConfig.partnershipIdentifier}
                />
              </TableCell>
            )}
            <TableCell>
              <div className={classes.actionsRow}>
                {!isAccountDeactivated(partnershipAccount) ||
                !onActivateAccount ? (
                  <>
                    <IconButton
                      onClick={onEditAccountCallback(partnershipAccount)}
                    >
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton
                      onClick={onDeleteAccountCallback(partnershipAccount)}
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
                      onClick={onActivateAccountCallback(partnershipAccount)}
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
  accountRow: {
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

export default React.memo(PartnershipAccountTable);
