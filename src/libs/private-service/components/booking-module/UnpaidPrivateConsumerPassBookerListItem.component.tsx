import React from 'react';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation, WithTranslation } from 'react-i18next';
import { compose } from 'recompose';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { MaterialStyleType } from '../../../../utils/types';
import type { PrivateSlot } from '#libs/private-service/types';

type OwnProps = {
  onBook?: () => void;
  selected?: boolean;
  divider?: boolean;
  disabled?: boolean;
  privateSlot?: PrivateSlot;
  privateSlotCredit?: number;
};
type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof useStyles>>;

export const UnpaidPrivateConsumerPassBookerListItem = (props: Props) => {
  const [openConfirm, setOpenConfirm] = React.useState<boolean>(false);
  const classes = useStyles();
  const { t } = useTranslation('privateService');
  return (
    <>
      <ListItem
        divider={!!props.divider}
        selected={!!props.selected}
        dense
        disabled={!!props.disabled}
      >
        <ListItemText
          primary={
            <Typography>{t('bookerModule.unpaidBooking.header')}</Typography>
          }
          secondary={
            <Typography
              className={classes.secondaryText}
              color="textPrimary"
              variant="caption"
            >
              {t('bookerModule.unpaidBooking.helper')}
            </Typography>
          }
        />
        <Button
          onClick={() => setOpenConfirm(true)}
          color="primary"
          variant="outlined"
        >
          {t('bookerModule.unpaidBooking.book')}
        </Button>
      </ListItem>

      <Dialog open={openConfirm}>
        <DialogTitle> {t('bookerModule.unpaidBooking.header')}</DialogTitle>
        <DialogContent>
          {t('bookerModule.unpaidBooking.dialogHelper', {
            credits: props.privateSlot?.credit || props.privateSlotCredit,
          })}
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={() => setOpenConfirm(false)}>
            {t('bookerModule.cancel')}
          </Button>
          <Button variant="contained" color="primary" onClick={props.onBook}>
            {t('bookerModule.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  secondaryText: {
    paddingRight: theme.spacing(2),
  },
}));
export default compose<any, OwnProps>()(
  UnpaidPrivateConsumerPassBookerListItem,
);
