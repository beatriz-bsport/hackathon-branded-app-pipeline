// @flow
import React from 'react';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import type { TFunction } from 'react-i18next';
import type { Permission } from '../types';

type Props = {
  permissions: Array<Permission>,
  t: TFunction,
  classes: Object,
};

export const PermissionList = (props: Props) => {
  const { t, classes, permissions } = props;
  return (
    <div className={classes.container}>
      <List dense disablePadding>
        {permissions.map((perm) => (
          <div className={classes.permission} key={perm.id}>
            <Typography variant="subtitle2">
              {t(`roleDescription.${perm.id}.name`)}
            </Typography>
            <Typography>
              {t(`roleDescription.${perm.id}.description`)}
            </Typography>
          </div>
        ))}
      </List>
    </div>
  );
};

const styles = (theme) => ({
  permission: {
    paddingBottom: theme.spacing(1),
  },
});

export default compose(
  withTranslation(['role']),
  withStyles(styles),
)(PermissionList);
