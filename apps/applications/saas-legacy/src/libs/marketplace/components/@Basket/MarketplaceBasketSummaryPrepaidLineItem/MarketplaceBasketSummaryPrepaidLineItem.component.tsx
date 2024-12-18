import React from 'react';
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';

import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import { PrepaidLine } from '#src/libs/checkout/types';

import './styles.css';

export type Props = {
  prePaidLine: PrepaidLine;
};

type PrepaidLineIconProps = Props;

const PrepaidLineIcon: React.FC<PrepaidLineIconProps> = ({ prePaidLine }) => {
  if (prePaidLine?.extra_data?.internal_account !== undefined) {
    return (
      <AccountBalanceWalletIcon className="bs-basket_summary_prepaid_line_item--icon" />
    );
  }
  if (prePaidLine?.extra_data?.consumer_giftcard_id !== undefined) {
    return (
      <CardGiftcardIcon className="bs-basket_summary_prepaid_line_item--icon" />
    );
  }
  return <p className="bs-basket_summary_prepaid_line_item--quantity">x1</p>;
};

const PrepaidLineListItemCssOnly: React.FC<Props> = ({ prePaidLine }) => {
  const prepaidLinePrice = React.useMemo(
    () => getCurrencyDisplayWithPrice(-prePaidLine.unit_value),
    [prePaidLine],
  );

  return (
    <div className="bs-basket_summary_prepaid_line_item--container">
      <div className="bs-basket_summary_prepaid_line_item--icon_and_title_container ">
        <div className="bs-basket_summary_prepaid_line_item--icon_container">
          <PrepaidLineIcon prePaidLine={prePaidLine} />
        </div>
        <p className="bs-basket_summary_prepaid_line_item--title">
          {prePaidLine.name}
        </p>
      </div>

      <p className="bs-basket_summary_prepaid_line_item--price">
        {prepaidLinePrice}
      </p>
    </div>
  );
};

export default React.memo(PrepaidLineListItemCssOnly);
