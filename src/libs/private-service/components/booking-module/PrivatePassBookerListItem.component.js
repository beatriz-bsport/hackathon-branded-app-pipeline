// @flow
import React from 'react';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import withStyles from '@material-ui/core/styles/withStyles';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import type { PrivatePass } from '../../types';

type Props = {
  private_pass: PrivatePass,
  onClick: () => void,
  t: TFunction,
  classes: Object,
};

export const PrivatePassBookerListItem = (props: Props) => {
  const { private_pass, t, classes } = props;
  return (
    <ListItem>
      <ListItemText
        primary={private_pass.name}
        secondary={t('bookerModule.private_pass.credits', {
          credits: private_pass.credits,
        })}
      />
      <Button color="primary" variant="outlined" onClick={props.onClick}>
        <AddShoppingCartIcon className={classes.leftIcon} />
        {t('bookerModule.buyPass', { price: private_pass.price })}
      </Button>
    </ListItem>
  );
};

const styles = (theme) => ({
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

export default withStyles(styles)(
  withNamespaces(['privateService'])(PrivatePassBookerListItem),
);
