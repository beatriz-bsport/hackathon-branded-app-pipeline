// @flow
import React from 'react';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import { useTranslation } from 'react-i18next';

import StyleIcon from '@material-ui/icons/Style';
import makeStyles from '@material-ui/styles/makeStyles';
import IconButton from '@material-ui/core/IconButton';
import type { Theme } from '@material-ui/core/styles';
import type { PrivatePass } from '../../types';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';
import Tooltip from '#components/Tooltip.component';

type Props = {
  private_pass: PrivatePass;
  onClick: () => void;
  divider?: boolean;
  isExcludingTax?: boolean;
};

export const PrivatePassBookerListItem = (props: Props) => {
  const { private_pass } = props;
  const { t } = useTranslation('privateService');
  const classes = useStyles();
  return (
    <ListItem divider={props.divider}>
      <ListItemText
        primary={private_pass.name}
        secondary={t('bookerModule.private_pass.credits', {
          credits: private_pass.credits,
        })}
      />
      {!!private_pass.linked_payment_pack && (
        <Tooltip title={t('privatePass.form.universalPass.label')}>
          <IconButton onClick={null}>
            <StyleIcon color="inherit" />
          </IconButton>
        </Tooltip>
      )}
      <Button color="primary" variant="outlined" onClick={props.onClick}>
        <AddShoppingCartIcon className={classes.leftIcon} />
        {getCurrencyDisplayWithPrice(
          private_pass.price,
          props.isExcludingTax,
          private_pass.tax,
        )}
      </Button>
    </ListItem>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  leftIcon: {
    marginRight: theme.spacing(1),
  },
}));
export default PrivatePassBookerListItem;
