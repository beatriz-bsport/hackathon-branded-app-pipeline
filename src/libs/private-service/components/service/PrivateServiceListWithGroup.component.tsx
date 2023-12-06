import React, { useCallback, useState } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import InfoOutlineIcon from '@material-ui/icons/InfoOutlined';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import DeleteIcon from '@material-ui/icons/Delete';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import PrivateServiceListItem from './PrivateServiceListItem.component';
import ObjectLevelPermissionProvider from '#libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import type {
  PrivateService,
  PrivateServiceGroupWithService,
} from '#libs/private-service/types';

type Props = {
  openServiceGroupToEdit: (
    privateServiceGroup: PrivateServiceGroupWithService,
  ) => void;
  deleteServiceGroup: (id: number) => void;
  goToPrivateService: (id: number) => void;
  setOpenEditForm: (privateService: PrivateService) => void;
  deletePrivateService: (id: number) => void;
  privateServiceAvailableWithoutGroup: PrivateService[];
  privateServiceAvailableByGroup: PrivateServiceGroupWithService[];
};

const useStyles = makeStyles((theme) => ({
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  titleRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceListPaperGroup: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
    overflow: 'hidden',
  },
  rowIsEmpty: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: theme.spacing(1),
    marginBottom: theme.spacing(4),
  },
  sectionTitle: {
    marginBottom: theme.spacing(1),
  },
  divider: {
    marginBottom: theme.spacing(2),
  },
}));

type PrivateServiceListProps = {
  deletePrivateService: (id: number) => void;
  goToPrivateService: (id: number) => void;
  hasDeletePermission: boolean;
  hasEditPermission: boolean;
  privateServiceGroupId?: number;
  privateServiceList: PrivateService[];
  setOpenEditForm: (privateService: PrivateService) => void;
};

const PrivateServiceList: React.FC<PrivateServiceListProps> = React.memo(
  ({
    deletePrivateService,
    goToPrivateService,
    hasDeletePermission,
    hasEditPermission,
    privateServiceGroupId,
    privateServiceList,
    setOpenEditForm,
  }) => {
    const handleGoToPrivateService = React.useCallback(
      (id: number) => goToPrivateService(id),
      [goToPrivateService],
    );

    const handleDeletePrivateService = useCallback(
      (privateService: PrivateService) =>
        hasDeletePermission
          ? () => deletePrivateService(privateService.id)
          : null,
      [deletePrivateService, hasDeletePermission],
    );

    const handleEditPrivateService = useCallback(
      (privateService: PrivateService) =>
        hasEditPermission ? () => setOpenEditForm(privateService) : null,
      [setOpenEditForm, hasEditPermission],
    );

    return (
      <>
        {(privateServiceList || []).map((privateService) => (
          <PrivateServiceListItem
            key={`private-service-group-${
              privateServiceGroupId ?? null
            }private-services-${privateService.id}`}
            onClick={handleGoToPrivateService}
            onDelete={handleDeletePrivateService(privateService)}
            onEdit={handleEditPrivateService(privateService)}
            privateService={privateService}
          />
        ))}
      </>
    );
  },
);

type PrivateServiceGroupListSectionProps = {
  deletePrivateService: (id: number) => void;
  goToPrivateService: (id: number) => void;
  hasDeletePermission: boolean;
  hasEditPermission: boolean;
  privateServiceGroup: PrivateServiceGroupWithService;
  setOpenEditForm: (privateService: PrivateService) => void;
};
const PrivateServiceGroupListSection: React.FC<PrivateServiceGroupListSectionProps> =
  React.memo(
    ({
      deletePrivateService,
      goToPrivateService,
      hasDeletePermission,
      hasEditPermission,
      privateServiceGroup,
      setOpenEditForm,
    }) => {
      const classes = useStyles();
      const { t } = useTranslation('privateService');
      if (!privateServiceGroup?.private_services?.length) {
        return (
          <div className={classes.rowIsEmpty}>
            <InfoOutlineIcon className={classes.leftIcon} />
            <Typography color="textSecondary">
              {t('serviceGroup.isEmpty')}
            </Typography>
          </div>
        );
      }

      return (
        <Paper className={classes.serviceListPaperGroup}>
          <PrivateServiceList
            deletePrivateService={deletePrivateService}
            goToPrivateService={goToPrivateService}
            hasDeletePermission={hasDeletePermission}
            hasEditPermission={hasEditPermission}
            privateServiceGroupId={privateServiceGroup.id}
            privateServiceList={privateServiceGroup.private_services}
            setOpenEditForm={setOpenEditForm}
          />
        </Paper>
      );
    },
  );

export const PrivateServiceListWithGroup: React.FC<Props> = ({
  openServiceGroupToEdit,
  deleteServiceGroup,
  goToPrivateService,
  setOpenEditForm,
  deletePrivateService,
  privateServiceAvailableWithoutGroup,
  privateServiceAvailableByGroup,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('privateService');
  const [menuOpen, setMenuOpen] = useState<
    [
      (EventTarget & HTMLButtonElement) | null,
      PrivateServiceGroupWithService | null,
    ]
  >([null, null]);

  const handleClickGroupMenu = useCallback(
    (privateServiceGroup: PrivateServiceGroupWithService) =>
      (event: React.MouseEvent<HTMLButtonElement>) =>
        setMenuOpen([event.currentTarget, privateServiceGroup]),
    [],
  );

  const handleCloseMenu = useCallback(() => setMenuOpen([null, null]), []);

  const handleEditPrivateServiceGroup = useCallback(() => {
    openServiceGroupToEdit(menuOpen[1]);
    setMenuOpen([null, null]);
  }, [menuOpen, openServiceGroupToEdit]);

  const handleDeletePrivateServiceGroup = useCallback(() => {
    deleteServiceGroup(menuOpen[1].id);
    setMenuOpen([null, null]);
  }, [deleteServiceGroup, menuOpen]);

  return (
    <div>
      <ObjectLevelPermissionProvider
        requiredPermission={[
          'management.privateService.allowed_actions.edit',
          'management.privateService.allowed_actions.delete',
        ]}
      >
        {([hasEditPermission, hasDeletePermission]: boolean[]) => (
          <>
            {privateServiceAvailableByGroup.map((privateServiceGroup) => (
              <div key={privateServiceGroup.id}>
                <div className={classes.titleRow}>
                  <Typography className={classes.sectionTitle} variant="h5">
                    {privateServiceGroup.name}
                  </Typography>

                  {(hasEditPermission || hasDeletePermission) && (
                    <IconButton
                      color="primary"
                      onClick={handleClickGroupMenu(privateServiceGroup)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  )}
                </div>
                <Divider className={classes.divider} />
                <PrivateServiceGroupListSection
                  deletePrivateService={deletePrivateService}
                  goToPrivateService={goToPrivateService}
                  hasDeletePermission={hasDeletePermission}
                  hasEditPermission={hasEditPermission}
                  privateServiceGroup={privateServiceGroup}
                  setOpenEditForm={setOpenEditForm}
                />
              </div>
            ))}
            <Paper className={classes.serviceListPaperGroup}>
              <PrivateServiceList
                deletePrivateService={deletePrivateService}
                goToPrivateService={goToPrivateService}
                hasDeletePermission={hasDeletePermission}
                hasEditPermission={hasEditPermission}
                privateServiceList={privateServiceAvailableWithoutGroup}
                setOpenEditForm={setOpenEditForm}
              />
            </Paper>
            <Menu
              anchorEl={menuOpen[0]}
              onClose={handleCloseMenu}
              open={!!menuOpen[0]}
            >
              <div>
                {hasEditPermission && (
                  <MenuItem onClick={handleEditPrivateServiceGroup}>
                    <EditIcon className={classes.leftIcon} />
                    {t('serviceGroup.edit')}
                  </MenuItem>
                )}

                {hasDeletePermission && (
                  <MenuItem onClick={handleDeletePrivateServiceGroup}>
                    <DeleteIcon className={classes.leftIcon} />
                    {t('serviceGroup.delete')}
                  </MenuItem>
                )}
              </div>
            </Menu>
          </>
        )}
      </ObjectLevelPermissionProvider>
    </div>
  );
};

export default React.memo(PrivateServiceListWithGroup);
