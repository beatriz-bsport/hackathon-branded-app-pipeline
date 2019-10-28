// @flow

import React from 'react';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose, withState } from 'recompose';

import VisibilityIcon from '@material-ui/icons/Visibility';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Dialog from '@material-ui/core/Dialog';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import PaymentPackCard from '../../payment-packs/components/PaymentPackCard.component';

type Props = {
  t: TFunction,
  selectedPass: *,
  setSelectedPass: (*) => void,
  paymentPacks: *[],
  pushPackCheckout: (number) => void,
  classes: Object,
};

export function MarketplacePassList(props: Props) {
  const { paymentPacks, t, pushPackCheckout, selectedPass } = props;
  return (
    <div>
      <Typography
        component="h3"
        variant="h6"
        className={props.classes.sectionTitle}
      >
        {props.t('marketplace.passListTitle')}
      </Typography>
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
                    : `${pp.credits} ${t('paymentPack.credits').toLowerCase()}`
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
      </Paper>
    </div>
  );
}
const styles = (theme) => ({
  sectionTitle: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 1,
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(),
  withState('selectedPass', 'setSelectedPass', null),
)(MarketplacePassList);
