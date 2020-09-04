// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Divider from '@material-ui/core/Divider';
import ButtonBase from '@material-ui/core/ButtonBase';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { withState, compose } from 'recompose';

import PaymentMethodListItem from './PaymentMethodListItem.component';
import CollectPaymentMethod from './CollectPaymentMethod.component';

type Props = {
  isExpanded: boolean,
  isExpandable?: boolean,
  setExpanded: (boolean) => void,
  disabled: boolean,
  savedPaymentMethodList: Array<PaymentMethod>,
  selectedSavedPaymentMethodId: string,
  onSelect: (string) => void,
  showEmpty?: boolean,

  refreshSavedPaymentMethodList: () => void,

  setCollectPaymentMethodIsOpen: (boolean) => void,
  collectPaymentMethodIsOpen: boolean,
  requestSetupIntentSecret: () => void,
  paymentMethodType: string,
};

export const PaymentMethodList = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['payment']);
  if (
    !props.showEmpty &&
    (!props.savedPaymentMethodList || !props.savedPaymentMethodList.length)
  ) {
    return null;
  }
  const relevantSavedPaymentMethodList = (
    props.savedPaymentMethodList || []
  ).filter((pm) => props.paymentMethodType === pm.type);
  return (
    <div className={classes.container}>
      <ButtonBase
        onClick={() => props.setExpanded(!props.isExpanded)}
        className={classes.row}
      >
        <Typography variant="h6">
          {t('forms.savePaymentMethod.section', {
            count: relevantSavedPaymentMethodList.length,
          })}
        </Typography>
        <ExpandMoreIcon />
      </ButtonBase>
      <Divider />
      <Collapse in={props.isExpanded || !props.isExpandable}>
        {relevantSavedPaymentMethodList
          .filter(
            (pm) =>
              !props.selectedSavedPaymentMethodId ||
              props.selectedSavedPaymentMethodId === pm.id,
          )
          .map((pm) => (
            <PaymentMethodListItem
              paymentMethod={pm}
              key={pm.id}
              disabled={props.disabled}
              selected={pm.id === props.selectedSavedPaymentMethodId}
              onClick={props.onSelect}
            />
          ))}
        {!!props.requestSetupIntentSecret && (
          <ListItem
            button
            onClick={() => props.setCollectPaymentMethodIsOpen(true)}
          >
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText>
              {t('forms.paymentMethod.actions.addPaymentMethod')}
            </ListItemText>
          </ListItem>
        )}
      </Collapse>
      {props.collectPaymentMethodIsOpen && (
        <CollectPaymentMethod
          requestSetupIntentSecret={props.requestSetupIntentSecret}
          paymentMethodType={props.paymentMethodType}
          refreshSavedPaymentMethodList={props.refreshSavedPaymentMethodList}
          onClose={() => props.setCollectPaymentMethodIsOpen(false)}
        />
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {},
  row: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

export default compose(
  withState(
    'collectPaymentMethodIsOpen',
    'setCollectPaymentMethodIsOpen',
    false,
  ),
  withState('isExpanded', 'setExpanded', false),
)(PaymentMethodList);
