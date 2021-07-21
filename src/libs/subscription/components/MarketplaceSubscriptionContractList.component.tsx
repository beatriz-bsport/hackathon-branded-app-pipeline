// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import { Theme } from '@material-ui/core';
import { TFunction } from 'i18next';
import Typography from '@material-ui/core/Typography';
import { getCurrencyDisplay } from '../../theme/selectors';
import type { ContractWithPaymentPack } from '../types';
import { MaterialStyleType } from '../../../utils/types';

type OwnProps = {
  contractList: Array<ContractWithPaymentPack>;
  selected: number;
  onClick: (c: ContractWithPaymentPack) => void;
};
type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

const ContractCard = (
  props: {
    t: TFunction;
    contract: ContractWithPaymentPack;
    onClick: (c: ContractWithPaymentPack) => void;
    selected: number;
  } & MaterialStyleType<ReturnType<typeof styles>>,
) => {
  return (
    <Card
      className={
        props.selected === props.contract.id
          ? props.classes.cardSelected
          : props.classes.card
      }
      raised={props.selected === props.contract.id}
    >
      <div className={props.classes.cardInner}>
        <CardContent>
          <Typography variant="h6" component="h2">
            {`${props.contract.name} - ${
              props.contract.recurrent_price
            }${getCurrencyDisplay()} ${
              parseFloat(props.contract.flat_fee)
                ? ` (+${props.contract.flat_fee}${getCurrencyDisplay()})`
                : ''
            }`}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            {`${
              (props.contract.payment_pack &&
                props.contract.payment_pack.name) ||
              (props.contract.private_pass &&
                props.contract.private_pass.name) ||
              (props.contract.payment_combo &&
                props.contract.payment_combo.name) ||
              ''
            }${
              props.contract.auto_renewal
                ? ''
                : `- ${props.t('contract.duration', {
                    month: props.contract.nb_interval,
                  })}`
            }`}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            color={
              props.selected === props.contract.id ? 'primary' : 'secondary'
            }
            onClick={props.onClick}
          >
            {props.t('seeMore')}
          </Button>
        </CardActions>
      </div>
    </Card>
  );
};
export const MarketplaceSubscriptionContractList = (props: Props) => {
  return (
    <div className={props.classes.container}>
      <div className={props.classes.contactListContainer}>
        {props.contractList.map((c) => (
          <div key={c.id} className={props.classes.cardContainer}>
            <ContractCard
              t={props.t}
              classes={props.classes}
              contract={c}
              onClick={() => props.onClick(c)}
              selected={props.selected}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = (theme: Theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
  contactListContainer: {
    overflowX: 'auto',
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    flexDirection: 'row',
  },
  cardContainer: {
    paddingRight: theme.spacing(2),
    minWidth: 300,
  },
  card: {
    height: '100%',
  },
  cardSelected: {
    height: '100%',
    border: '2px solid',
    borderColor: theme.palette.primary.main,
  },
  cardInner: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});

export default compose<any, OwnProps>(
  withTranslation(['subscription']),
  // @ts-ignore
  withStyles(styles),
)(MarketplaceSubscriptionContractList);
