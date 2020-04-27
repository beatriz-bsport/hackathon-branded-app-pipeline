// @flow
import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState } from 'recompose';
import InfoOutlineIcon from '@material-ui/icons/InfoOutlined';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import DeleteIcon from '@material-ui/icons/Delete';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import PrivateServiceListItem from './PrivateServiceListItem.component';

type Props = {
  t: TFunction,
  classes: Object,
  setMenuOpen: ([?HTMLElement, ?ServiceGroup]) => void,
  menuOpen: [?HTMLElement, ?ServiceGroup],
  privateServiceAvailableByGroup: { [string]: Array<PrivateService> },
  openServiceGroupToEdit: (ServiceGroup) => void,
  deleteServiceGroup: (id: number) => void,
  goToPrivateService: (id: number) => void,
  setOpenEditForm: (ServiceGroup) => void,
  deletePrivateService: (id: number) => void,
  privateServiceAvailableWithoutGroup: Array<PrivateService>,
};

export const PrivateServiceListWithGroup = (props: Props) => {
  const { classes, t } = props;
  return (
    <div>
      {props.privateServiceAvailableByGroup.map((g) => (
        <div key={g.id}>
          <div className={classes.titleRow}>
            <Typography variant="h6">{g.name}</Typography>
            <IconButton
              color="primary"
              onClick={(ev) => props.setMenuOpen([ev.currentTarget, g])}
            >
              <MoreVertIcon />
            </IconButton>
          </div>
          <Divider />
          {g.private_services.length > 0 ? (
            <Paper className={classes.serviceListPaperGroup}>
              {g.private_services.map((ps) => (
                <PrivateServiceListItem
                  key={ps.id}
                  privateService={ps}
                  onClick={props.goToPrivateService}
                  onEdit={() => props.setOpenEditForm(ps)}
                  onDelete={() => props.deletePrivateService(ps.id)}
                />
              ))}
            </Paper>
          ) : (
            <div className={classes.rowIsEmpty}>
              <InfoOutlineIcon className={classes.leftIcon} />
              <Typography color="textSecondary">
                {t('serviceGroup.isEmpty')}
              </Typography>
            </div>
          )}
        </div>
      ))}
      <Paper className={classes.serviceListPaperGroup}>
        {props.privateServiceAvailableWithoutGroup.map((ps) => (
          <PrivateServiceListItem
            key={ps.id}
            privateService={ps}
            onClick={props.goToPrivateService}
            onEdit={() => props.setOpenEditForm(ps)}
            onDelete={() => props.deletePrivateService(ps.id)}
          />
        ))}
      </Paper>
      <Menu
        onClose={() => props.setMenuOpen([null, null])}
        anchorEl={props.menuOpen[0]}
        open={!!props.menuOpen[0]}
      >
        <div className={classes.actionButtonGroup}>
          <MenuItem
            onClick={() => {
              props.openServiceGroupToEdit(props.menuOpen[1]);
              props.setMenuOpen([null, null]);
            }}
          >
            <EditIcon className={classes.leftIcon} />
            {t('serviceGroup.edit')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              props.deleteServiceGroup(props.menuOpen[1].id);
              props.setMenuOpen([null, null]);
            }}
          >
            <DeleteIcon className={classes.leftIcon} />
            {t('serviceGroup.delete')}
          </MenuItem>
        </div>
      </Menu>
    </div>
  );
};

const styles = (theme) => ({
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  titleRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceListPaperGroup: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 4,
  },
  rowIsEmpty: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 4,
  },
});

export default compose(
  withNamespaces(['privateService']),
  withStyles(styles),
  withState('menuOpen', 'setMenuOpen', [null, null]),
)(PrivateServiceListWithGroup);
