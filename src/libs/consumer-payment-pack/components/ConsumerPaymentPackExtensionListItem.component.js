// @flow
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { formatAsDatetime } from '../../../utils/datetime';
import withConfirm from '../../../hocs/with-confirm.hoc';
import type { ConsumerPaymentPackExtension } from '../types';

type Props = {
  t: TFunction,
  extension: ConsumerPaymentPackExtension,
  onDelete: () => void,
  divider: ?boolean,
};

const DeleteButton = (props: { onClick: () => void }) => (
  <IconButton onClick={props.onClick}>
    <DeleteIcon />
  </IconButton>
);

const DeleteButtonWithConfirm = withConfirm(DeleteButton, 'onClick', {
  title: 'paymentPack:extension.delete.title',
  cancel: 'paymentPack:extension.delete.cancel',
  confirm: 'paymentPack:extension.delete.confirm',
  Content: ({ t }: { t: TFunction }) => (
    <p>{t('paymentPack:extension.delete.explain')}</p>
  ),
});
export const ConsumerPaymentPackExtensionListItem = (props: Props) => {
  const { extension, t } = props;
  return (
    <ListItem divider={!!props.divider}>
      <ListItemIcon>
        <Typography variant="subtitle1" color="primary">
          {t('extension.nbDaysAdded', {
            nb_days: extension.nb_days,
          })}
        </Typography>
      </ListItemIcon>
      <ListItemText
        primary={
          t('extension.addedOn') + formatAsDatetime(extension.date_created)
        }
        secondary={extension.note}
      />
      {!!props.onDelete && (
        <ListItemSecondaryAction>
          <DeleteButtonWithConfirm onClick={props.onDelete} />
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
};

export default withTranslation(['paymentPack'])(
  ConsumerPaymentPackExtensionListItem,
);
