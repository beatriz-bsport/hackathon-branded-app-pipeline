// @flow
import React from 'react';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose } from 'recompose';

import RedButton from '../../../../components/button/RedButton.component';
import type { PrivateConsumerPass } from '../../types';

type Props = {
  private_consumer_pass: PrivateConsumerPass,
  onClick?: () => void,
  onBook?: () => void,
  t: TFunction,
  classes: Object,
  selected?: boolean,
  divider?: boolean,
};

export const PrivateConsumerPassBookerListItem = (props: Props) => {
  const { private_consumer_pass, t, classes } = props;
  const { private_pass } = private_consumer_pass;
  return (
    <ListItem
      divider={!!props.divider}
      selected={!!props.selected}
      button={!!props.onClick}
      onClick={props.onClick}
      className={private_consumer_pass.reverted ? classes.disabled : null}
    >
      <ListItemText
        primary={private_pass.name}
        secondary={t('consumerPass.current_credits', {
          credits: private_pass.credits,
          current_credits:
            private_pass.credits - private_consumer_pass.used_credits,
        })}
      />
      {props.onBook && !private_consumer_pass.reverted ? (
        <Button color="primary" variant="outlined" onClick={props.onBook}>
          {t('bookerModule.useCredit')}
        </Button>
      ) : null}
      {private_consumer_pass.reverted ? (
        <RedButton variant="outlined">{t('consumerPass.isReverted')}</RedButton>
      ) : null}
    </ListItem>
  );
};

const styles = () => ({
  disabled: {
    backgroundColor: '#FFDDDD',
    '&:hover': {
      backgroundColor: '#FFC1C1',
    },
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(['privateService']),
)(PrivateConsumerPassBookerListItem);
