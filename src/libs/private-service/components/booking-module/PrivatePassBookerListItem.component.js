// @flow
import React from 'react';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import withStyles from '@material-ui/core/styles/withStyles';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import { withTranslation, TFunction } from 'react-i18next';

import type { PrivatePass } from '../../types';

import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';

type Props = {
  private_pass: PrivatePass,
  onClick: () => void,
  t: TFunction,
  classes: Object,
  divider?: boolean,
};

export const PrivatePassBookerListItem = (props: Props) => {
  const { private_pass, t, classes } = props;
  return (
    <ListItem divider={props.divider}>
      <ListItemText
        primary={private_pass.name}
        secondary={t('bookerModule.private_pass.credits', {
          credits: private_pass.credits,
        })}
      />
      <Button color="primary" variant="outlined" onClick={props.onClick}>
        <AddShoppingCartIcon className={classes.leftIcon} />
        {getCurrencyDisplayWithPrice(
          (Math.round(private_pass.price * 100) / 100).toFixed(2),
        )}
      </Button>
    </ListItem>
  );
};

const styles = (theme) => ({
  leftIcon: {
    marginRight: theme.spacing(1),
  },
});

export default withStyles(styles)(
  withTranslation(['privateService'])(PrivatePassBookerListItem),
);
