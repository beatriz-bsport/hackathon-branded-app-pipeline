import React from 'react';
import type { PrepaidLine } from '#libs/checkout/types';

import MarketplaceBasketSummaryPrepaidLineItem from '#libs/marketplace/components/@Basket/MarketplaceBasketSummaryPrepaidLineItem';
import './styles.css';

export type Props = {
  prePaidLines: PrepaidLine[];
};

const MarketplaceBasketSummaryPrepaidLineList: React.FC<Props> = ({
  prePaidLines,
}) => {
  if (!prePaidLines) {
    return null;
  }
  return (
    <div className="bs-basket_summary_prepaid_line_list--container">
      {prePaidLines.map((prepaidLine, index) => (
        <>
          <MarketplaceBasketSummaryPrepaidLineItem
            key={`basket_summary_prepaid_line_item_${prepaidLine.name}`}
            prePaidLine={prepaidLine}
          />
          {index !== prePaidLines.length - 1 && (
            <div className="bs-basket_summary_prepaid_line_list--divider_container ">
              <div className="bs-basket_summary_prepaid_line_list--divider" />
            </div>
          )}
        </>
      ))}
    </div>
  );
};

export default React.memo(MarketplaceBasketSummaryPrepaidLineList);
