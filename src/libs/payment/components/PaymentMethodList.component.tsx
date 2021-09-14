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
import LinearProgress from '@material-ui/core/LinearProgress';

import PaymentMethodListItem from './PaymentMethodListItem.component';
import CollectPaymentMethod from './CollectPaymentMethod.component';
import { PaymentMethod } from '../types';

type Props = {
  isExpandable?: boolean;
  disabled: boolean;
  savedPaymentMethodList: Array<PaymentMethod>;
  selectedSavedPaymentMethodId: string;
  onSelect: (paymentMethodId: string) => void;
  showEmpty: boolean | null;

  refreshSavedPaymentMethodList: () => void;

  requestSetupIntentSecret: () => void;
  paymentMethodType: string;
  setHasDetached: (paymentMethodId: string) => void;
  detachPaymentMethodLoading: boolean;
  companyId: number | null;
  memberId: number | null;
  detachPaymentMethod: (pm_id: string) => void;
  snackbarErrorMsg: (msg: string) => void;
  snackbarSuccessMsg: (msg: string) => void;

  sepaDefaultName?: string;
  sepaDefaultEmail?: string;
};

export const PaymentMethodList = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['payment']);
  const [disableDuringDetach, setDisableDuringDetach] = React.useState(false);
  const [
    collectPaymentMethodIsOpen,
    setCollectPaymentMethodIsOpen,
  ] = React.useState(false);
  const [isExpanded, setExpanded] = React.useState(false);
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
        onClick={() => setExpanded(!isExpanded)}
        className={classes.row}
        disabled={props.disabled}
      >
        <Typography variant="h6">
          {t('forms.savePaymentMethod.section', {
            count: relevantSavedPaymentMethodList.length,
          })}
        </Typography>
        <ExpandMoreIcon />
      </ButtonBase>
      <Divider />
      {disableDuringDetach && <LinearProgress />}
      <Collapse in={(isExpanded || !props.isExpandable) && !props.disabled}>
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
              setHasDetached={props.setHasDetached}
              disableDuringDetach={disableDuringDetach}
              setDisableDuringDetach={setDisableDuringDetach}
              detachPaymentMethodLoading={props.detachPaymentMethodLoading}
              companyId={props.companyId}
              memberId={props.memberId}
              refreshSavedPaymentMethodList={
                props.refreshSavedPaymentMethodList
              }
              detachPaymentMethod={props.detachPaymentMethod}
              snackbarErrorMsg={props.snackbarErrorMsg}
              snackbarSuccessMsg={props.snackbarSuccessMsg}
              sepaDefaultName={props.sepaDefaultName}
              sepaDefaultEmail={props.sepaDefaultEmail}
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
      </Collapse>
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

export default PaymentMethodList;
