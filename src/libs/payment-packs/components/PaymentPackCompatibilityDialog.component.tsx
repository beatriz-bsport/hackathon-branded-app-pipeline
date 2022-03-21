import React from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import CategoryIcon from '@material-ui/icons/Category';
import StarIcon from '@material-ui/icons/Star';
import RoomIcon from '@material-ui/icons/Room';
import { useTheme } from '@material-ui/styles';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import { Theme, makeStyles } from '@material-ui/core/styles';

import { useMediaQuery } from '@material-ui/core';
import { MetaActivity } from '#libs/meta-activity/types';
import { Establishment } from '#libs/establishment/types';
import { SCS } from '#libs/category/types';

type Props = {
  activities: Array<MetaActivity>;
  categories: Array<SCS>;
  establishments: Array<Establishment>;
  onClose: () => void;
  onModify: () => void;
  open: boolean;
  isManager: boolean;
};

export const PaymentPackCompatibilityDialog = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['paymentPack']);
  const { open, categories, establishments, activities, isManager } = props;
  const theme: Theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Dialog
      open={open}
      className={classes.dialog}
      maxWidth="md"
      fullWidth
      fullScreen={fullScreen}
    >
      <div className={classes.dialogContent}>
        {categories?.length ? (
          <div className={classes.compatibilityList}>
            <CategoryIcon className={classes.topIcon} />
            <Typography variant="h6">{t('categories')}</Typography>
            <List>
              {categories.map((c: SCS) =>
                c ? (
                  <ListItem className={classes.listItem} key={c.id}>
                    {c.name}
                  </ListItem>
                ) : null,
              )}
            </List>
          </div>
        ) : null}
        {activities?.length ? (
          <div className={classes.compatibilityList}>
            <StarIcon className={classes.topIcon} />
            <Typography variant="h6">{t('activities')}</Typography>
            <List>
              {activities.map((a: MetaActivity) =>
                a ? (
                  <ListItem className={classes.listItem} key={a.id}>
                    {a.name}
                  </ListItem>
                ) : null,
              )}
            </List>
          </div>
        ) : null}
        {establishments?.length ? (
          <div className={classes.compatibilityList}>
            <RoomIcon className={classes.topIcon} />
            <Typography variant="h6">{t('establishments')}</Typography>
            <List>
              {establishments.map((e: Establishment) =>
                e ? (
                  <ListItem className={classes.listItem} key={e.id}>
                    {e.title}
                  </ListItem>
                ) : null,
              )}
            </List>
          </div>
        ) : null}
      </div>
      <DialogActions>
        {isManager && (
          <Button id="button_modify" color="primary" onClick={props.onModify}>
            {t('actions.edit')}
          </Button>
        )}
        <Button id="button_exit" onClick={props.onClose}>
          {t('actions.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  dialog: {
    maxHeight: '80vh',
    overflow: 'no',
    minWidth: '60vw',
    justifyContent: 'center',
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing(2),
    width: '100%',
    maxHeight: '70vh',
    overflow: 'scroll',
    justifyContent: 'center',
  },
  topIcon: {
    color: '#868686',
    marginBottom: theme.spacing(1.5),
    height: 30,
  },
  compatibilityList: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    width: '15vw',
  },
  listItem: {
    textAlign: 'center',
    justifyContent: 'center',
  },
}));

export default PaymentPackCompatibilityDialog;
