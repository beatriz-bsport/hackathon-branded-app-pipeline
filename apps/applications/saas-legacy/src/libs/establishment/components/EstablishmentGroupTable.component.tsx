import React, { useCallback, useState } from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';

import withStyles from '@material-ui/core/styles/withStyles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import { IconButton } from '@material-ui/core';
import { MarketingNotification } from '#src/libs/marketing/types';
import NotificationBellWithBadge from '#src/components/marketing/NotificationBell.component';
import { MaterialStyleType } from '../../../utils/types';
import type { EstablishmentGroup } from '../types';
import DeleteObjectModal from '#src/libs/delete-object/components/DeleteObjectModal.component';
import { DeleteObjectVariant } from '#src/libs/delete-object/types';

type OwnProps = {
  establishmentGroupList: Array<EstablishmentGroup>;
  onEditEstablishmentGroup: (group: EstablishmentGroup) => void;
  setEstablishmentGroupNotificationsToEdit: (
    EstablishmentGroup: number,
  ) => void;
  marketingNotificationByEstablishmentGroup: {
    [key: string]: Array<MarketingNotification>;
  };
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

export const EstablishmentGroupTable = (props: Props) => {
  const { t, classes } = props;
  const {
    establishmentGroupList,
    onEditEstablishmentGroup,
    marketingNotificationByEstablishmentGroup,
    setEstablishmentGroupNotificationsToEdit,
  } = props;

  const [establishmentGroupIdToDelete, setEstablishmentGroupIdToDelete] =
    useState(null);

  const handleSelectEstablishmentGroupIdToDelete = useCallback((id: number) => {
    setEstablishmentGroupIdToDelete(id);
  }, []);

  const handleClearEstablishmentGroupIdToDelete = useCallback(
    () => setEstablishmentGroupIdToDelete(null),
    [],
  );

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('group.table.name')}</TableCell>
            <TableCell>{t('group.table.establishment')}</TableCell>
            <TableCell align="center">{t('group.table.actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {establishmentGroupList &&
            establishmentGroupList.map((group: EstablishmentGroup) => (
              <TableRow key={group.id}>
                <TableCell> {group.name}</TableCell>
                <TableCell>
                  {group.establishment &&
                    group.establishment.map((est) => (
                      <Chip
                        key={`establishment-${est.id}`}
                        avatar={
                          <Avatar alt={`${est.title}`} src={`${est.cover}`} />
                        }
                        className={classes.chip}
                        color="primary"
                        label={`${est.title}`}
                        variant="outlined"
                      />
                    ))}
                </TableCell>
                <TableCell align="right">
                  <NotificationBellWithBadge
                    badgeContent={
                      marketingNotificationByEstablishmentGroup[group.id]
                        ?.length || 0
                    }
                    isDisabled={
                      !marketingNotificationByEstablishmentGroup[
                        group.id
                      ]?.filter((m) => !!m?.active)?.length
                    }
                    onClick={() =>
                      setEstablishmentGroupNotificationsToEdit(group.id)
                    }
                  />
                  <IconButton onClick={() => onEditEstablishmentGroup(group)}>
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      handleSelectEstablishmentGroupIdToDelete(group.id)
                    }
                  >
                    <DeleteIcon className={classes.greyIcon} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <DeleteObjectModal
        idToCheckAndDelete={establishmentGroupIdToDelete}
        onClose={handleClearEstablishmentGroupIdToDelete}
        variant={DeleteObjectVariant.ESTABLISHMENT_GROUP}
      />
    </>
  );
};
const styles = (theme: Theme) => ({
  chip: {
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
  greyIcon: {
    color: theme.palette.grey[700],
  },
});
export default compose<any, OwnProps>(
  withTranslation('establishment'),
  withStyles(styles),
)(EstablishmentGroupTable);
