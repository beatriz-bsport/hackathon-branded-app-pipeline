import React from 'react';
import classNames from 'classnames';
import type { PrepaidLine } from '#src/libs/checkout/types';

import MarketplaceBasketSummaryPrepaidLineItem from '#src/libs/marketplace/components/@Basket/MarketplaceBasketSummaryPrepaidLineItem';
import './styles.css';

export type Props = {
  prePaidLines: PrepaidLine[];
  dense?: boolean;
};

const MarketplaceBasketSummaryPrepaidLineList: React.FC<Props> = ({
  prePaidLines,
  dense,
}) => {
  if (!prePaidLines) {
    return null;
  }
  return (
    <div
      className={classNames('bs-basket_summary_prepaid_line_list--container', {
        'bs-basket_summary_prepaid_line_list--dense': dense,
      })}
    >
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
