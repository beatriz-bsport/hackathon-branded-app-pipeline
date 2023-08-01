// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import CircularProgress from '@material-ui/core/CircularProgress';
import PrivateConsumerPassBookerListItem from '../../private-service/components/booking-module/PrivateConsumerPassBookerListItem.component';

import ConsumerPaymentPackListItemCheckout from '../../consumer-payment-pack/components/ConsumerPaymentPackListItemCheckout.component';

type Props = {
  loading: boolean,
  open: boolean,
  consumerPaymentPackList: Array<ConsumerPaymentPack>,
  privateConsumerPassList: Array<PrivateConsumerPass>,
  onClose: () => void,
  creditPrice: number,
  onBuyPass: () => void,
  registerVideo: (stuff: {
    consumer_payment_pack?: number,
    private_consumer_pass?: number,
  }) => void,
};

export const RegisterVideoDialog = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['video']);

  if (props.loading) {
    return (
      <Dialog open={props.open}>
        <DialogTitle>{t('video.register.title')}</DialogTitle>
        <DialogContent>
          <div className={classes.loadingContainer}>
            <CircularProgress />
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Dialog onClose={props.onClose} open={props.open}>
      <DialogTitle>{t('video.register.title')}</DialogTitle>
      <DialogContent>
        {props.consumerPaymentPackList.map((cpp) => (
          <ConsumerPaymentPackListItemCheckout
            key={cpp.id}
            consumerPack={cpp}
            creditPrice={props.creditPrice}
            onBookFromPack={() =>
              props.registerVideo({ consumer_payment_pack: cpp.id })
            }
          />
        ))}
        {props.privateConsumerPassList.map((pcp) => (
          <PrivateConsumerPassBookerListItem
            key={pcp.id}
            divider
            onBook={() =>
              props.registerVideo({ private_consumer_pass: pcp.id })
            }
            private_consumer_pass={pcp}
          />
        ))}
        {!props.consumerPaymentPackList.length &&
          !props.privateConsumerPassList.length && (
            <Typography className={classes.hasNothing}>
              {t('video.register.noPassAvailable')}
            </Typography>
          )}
        <div className={classes.bottomButton}>
          <Button
            className={classes.bottomButton}
            color="primary"
            onClick={props.onBuyPass}
            variant="contained"
          >
            {t('video.register.buyPass')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {},
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  bottomButton: {
    marginTop: theme.spacing(2),
    width: '100%',
  },
  hasNothing: {
    margin: theme.spacing(2),
  },
}));

export default RegisterVideoDialog;
