// @flow

import React from 'react';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose, withState } from 'recompose';

import VisibilityIcon from '@material-ui/icons/Visibility';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Dialog from '@material-ui/core/Dialog';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

// eslint-disable-next-line
import PaymentPackCard from '../../libs/payment-packs/PaymentPackCard.component';

type Props = {
  t: TFunction,
  classes: Object,
  selectedPass: *,
  setSelectedPass: (*) => void,
  paymentPacks: *[],
  pushPackCheckout: (number) => void,
};

export function MarketplacePassList(props: Props) {
  const { paymentPacks, t, classes, pushPackCheckout, selectedPass } = props;
  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <Paper>
          <List dense disablePadding>
            {paymentPacks.map((pp) => (
              <ListItem
                key={pp.id}
                divider
                button
                onClick={() => props.setSelectedPass(pp)}
              >
                <ListItemText
                  primary={`${pp.name} - ${pp.price}€`}
                  secondary={
                    pp.unlimited
                      ? t('paymentPack.unlimitedCredits')
                      : `${pp.credits} ${t(
                          'paymentPack.credits',
                        ).toLowerCase()}`
                  }
                />

                <IconButton
                  style={{ marginRight: 16 }}
                  disableRipple
                  onClick={() => props.setSelectedPass(pp)}
                >
                  <VisibilityIcon />
                </IconButton>
                <ListItemSecondaryAction>
                  <React.Fragment>
                    <IconButton
                      color="primary"
                      onClick={() => pushPackCheckout(pp.id)}
                    >
                      <AddShoppingCartIcon />
                    </IconButton>
                  </React.Fragment>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
        <Dialog
          open={!!selectedPass}
          onClose={() => props.setSelectedPass(null)}
        >
          <div>
            {selectedPass ? (
              <PaymentPackCard
                pack={{
                  ...selectedPass,
                  metaActivities: selectedPass.metaActivities.map(
                    (ma) => ma.id,
                  ),
                  establishments: selectedPass.establishments.map((e) => e.id),
                }}
                metaActivities={selectedPass.metaActivities}
                establishments={selectedPass.establishments}
                onlyPublic
              />
            ) : null}
            <Button
              style={{ width: '100%' }}
              onClick={() => pushPackCheckout(selectedPass.id)}
              color="primary"
              variant="contained"
            >
              {t('marketplace.buyPack')}
            </Button>
          </div>
        </Dialog>
      </div>
    </div>
  );
}

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '50%',
    },
    margin: theme.spacing.unit * 2,
  },
});

export default compose(
  withNamespaces(),
  withStyles(styles),
  withState('selectedPass', 'setSelectedPass', null),
)(MarketplacePassList);
