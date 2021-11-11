// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import AddIcon from '@material-ui/icons/Add';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LinearProgress from '@material-ui/core/LinearProgress';

import PaymentMethodListItem from '../PaymentMethodListItem.component';
import CollectPaymentMethod from '../CollectPaymentMethod.component';
import { PaymentMethod } from '../../types';

type Props = {
  disabled: boolean;
  savedPaymentMethodList: Array<PaymentMethod>;
  selectedSavedPaymentMethodId?: string;
  onSelect: (paymentMethodId: string) => void;
  showEmpty: boolean | null;

  refreshSavedPaymentMethodList?: () => void;

  requestSetupIntentSecret?: () => void;
  paymentMethodType?: string;
  setHasDetached?: (paymentMethodId: string) => void;
  detachPaymentMethodLoading?: boolean;
  companyId: number | null;
  memberId: number | null;
  detachPaymentMethod?: (pm_id: string) => void;
  snackbarErrorMsg?: (msg: string) => void;
  snackbarSuccessMsg?: (msg: string) => void;

  sepaDefaultName?: string;
  sepaDefaultEmail?: string;
};

export const PaymentMethodList = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['payment']);
  const [disableDuringDetach, setDisableDuringDetach] = React.useState(false);
  const [collectPaymentMethodIsOpen, setCollectPaymentMethodIsOpen] =
    React.useState(false);

  if (
    !props.showEmpty &&
    (!props.savedPaymentMethodList || !props.savedPaymentMethodList.length)
  ) {
    return null;
  }

  const relevantSavedPaymentMethodList = props.paymentMethodType
    ? (props.savedPaymentMethodList || []).filter(
        (pm) => props.paymentMethodType === pm.type,
      )
    : props.savedPaymentMethodList;

  return (
    <div className={classes.container}>
      {disableDuringDetach && <LinearProgress />}
      {relevantSavedPaymentMethodList.map((pm) => (
        <PaymentMethodListItem
          paymentMethod={pm}
          key={pm.id}
          disabled={props.disabled}
          selected={pm.id === props.selectedSavedPaymentMethodId}
          onClick={() => props.onSelect(pm.id)}
          setHasDetached={props.setHasDetached}
          disableDuringDetach={disableDuringDetach}
          setDisableDuringDetach={setDisableDuringDetach}
          detachPaymentMethodLoading={props.detachPaymentMethodLoading}
          companyId={props.companyId}
          memberId={props.memberId}
          refreshSavedPaymentMethodList={props.refreshSavedPaymentMethodList}
          detachPaymentMethod={props.detachPaymentMethod}
          snackbarErrorMsg={props.snackbarErrorMsg}
          snackbarSuccessMsg={props.snackbarSuccessMsg}
          sepaDefaultName={props.sepaDefaultName}
          sepaDefaultEmail={props.sepaDefaultEmail}
          className={classes.item}
        />
      ))}
      {!!props.requestSetupIntentSecret && (
        <ListItem button onClick={() => setCollectPaymentMethodIsOpen(true)}>
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText>
            {t('forms.paymentMethod.actions.addPaymentMethod')}
          </ListItemText>
        </ListItem>
      )}
      {collectPaymentMethodIsOpen && (
        <CollectPaymentMethod
          requestSetupIntentSecret={props.requestSetupIntentSecret}
          paymentMethodType={props.paymentMethodType}
          refreshSavedPaymentMethodList={props.refreshSavedPaymentMethodList}
          onClose={() => setCollectPaymentMethodIsOpen(false)}
          defaultName={props.sepaDefaultName}
          defaultEmail={props.sepaDefaultEmail}
        />
      )}
    </div>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  item: {
    flex: '1',
  },
}));

export default PaymentMethodList;
