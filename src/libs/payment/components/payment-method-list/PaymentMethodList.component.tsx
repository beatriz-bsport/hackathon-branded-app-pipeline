// @ts-nocheck
// @flow
import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import AddIcon from '@material-ui/icons/Add';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LinearProgress from '@material-ui/core/LinearProgress';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { AxiosResponse } from 'axios';
import { OptionCallback } from '../../../../state/types';
import PaymentMethodListItem from '../PaymentMethodListItem.component';
import CollectPaymentMethod from '../CollectPaymentMethod.component';
import { PaymentMethod } from '../../types';

type Props = {
  disabled?: boolean;
  savedPaymentMethodList: Array<PaymentMethod>;
  selectedSavedPaymentMethodId?: string;
  onSelect: (paymentMethodId: string) => void;
  showEmpty?: boolean | null;

  refreshSavedPaymentMethodList?: () => void;

  requestSetupIntentSecret?: () => Promise<AxiosResponse<any>>;
  paymentMethodType?: string;
  setHasDetached?: (paymentMethodId: string) => void;
  detachPaymentMethodLoading?: boolean;
  companyId: number | null;
  memberId?: number | null;
  detachPaymentMethod?: (pm_id: string, options?: OptionCallback) => void;
  snackbarErrorMsg?: (msg: string) => void;
  snackbarSuccessMsg?: (msg: string) => void;
  onlyDefault?: boolean;

  sepaDefaultName?: string;
  sepaDefaultEmail?: string;
  onlinePaymentEnabled?: boolean;
};

export const PaymentMethodList = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['payment']);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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

  const defaultPaymentMethod = relevantSavedPaymentMethodList.find(
    (pm) => pm.is_default,
  );

  const onlinePaymentEnabled = props.onlinePaymentEnabled !== false;

  return (
    <div className={classes.container}>
      {disableDuringDetach && <LinearProgress />}
      {(props.onlyDefault && defaultPaymentMethod
        ? [defaultPaymentMethod]
        : relevantSavedPaymentMethodList
      ).map((pm) => (
        <PaymentMethodListItem
          paymentMethod={pm}
          key={pm.id}
          disabled={props.disabled}
          selected={pm.id === props.selectedSavedPaymentMethodId}
          onClick={props.onSelect && (() => props.onSelect(pm.id))}
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
      {!!props.requestSetupIntentSecret && onlinePaymentEnabled && (
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
          fullScreen={isMobile}
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
    listStyleType: 'none',
    li: {
      listStyleType: 'none',
    },
  },
  item: {
    flex: '1',
  },
}));

export default React.memo(PaymentMethodList);
