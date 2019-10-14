// @flow
import React from 'react';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import type { PrivateConsumerPass } from '../../types';

type Props = {
  private_consumer_pass: PrivateConsumerPass,
  onClick: () => void,
  t: TFunction,
};

export const PrivateConsumerPassBookerListItem = (props: Props) => {
  const { private_consumer_pass, t } = props;
  const { private_pass } = private_consumer_pass;
  return (
    <ListItem>
      <ListItemText
        primary={private_pass.name}
        secondary={t('consumerPass.current_credits', {
          credits: private_pass.credits,
          current_credits:
            private_pass.credits - private_consumer_pass.used_credits,
        })}
      />
      <Button color="primary" variant="outlined" onClick={props.onClick}>
        {t('bookerModule.useCredit')}
      </Button>
    </ListItem>
  );
};

export default withNamespaces(['privateService'])(
  PrivateConsumerPassBookerListItem,
);
