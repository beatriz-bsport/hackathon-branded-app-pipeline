import React from 'react';
import { useTranslation } from 'react-i18next';

import PersonIcon from '@material-ui/icons/Person';
import WarningIcon from '@material-ui/icons/Warning';
import AddIcon from '@material-ui/icons/Add';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';

import { BUYABLE_ITEM_FEE } from '@bsport/common/lib/master-data/buyable-items';
import { sortByDate } from '../../../../utils/datetime';
import type { Basket } from '#libs/checkout/types';
import type { Member } from '#libs/member/types';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';

import useStyles from './styles';

type BasketChipProps = {
  basket?: Basket;
  member: Member;
  isSelected: boolean;
  isFullyPaid: boolean;
  onClick: (basket: Basket) => void;
};

const BasketChip: React.FC<BasketChipProps> = ({
  basket,
  member,
  isSelected,
  isFullyPaid,
  onClick,
}) => {
  const { t } = useTranslation('quicksale');
  const classes = useStyles({ isSelected });

  const onChipClick = React.useCallback(
    () => onClick(basket),
    [onClick, basket],
  );

  const stopPropagation = React.useCallback((e) => {
    e.stopPropagation();
  }, []);

  const deliveryFeePrice = React.useMemo(
    () =>
      (basket.checkout_items || []).find(
        (checkoutItem) =>
          checkoutItem.buyable_item_identifier === BUYABLE_ITEM_FEE,
      )?.unit_price ?? 0,
    [basket.checkout_items],
  );

  return (
    <div
      className={classes.basketChipContainer}
      onClick={onChipClick}
      onKeyDown={stopPropagation}
      role="button"
      tabIndex={0}
    >
      <Avatar className={classes.basketChipAvatar}>
        {!member?.is_pos ? (
          <img alt="member" height={32} src={member?.photo} />
        ) : (
          <PersonIcon />
        )}
      </Avatar>

      <div className={classes.basketInfo}>
        <Typography variant="caption">
          {!member?.is_pos ? member?.name : t('interface.anonymousSale')}
        </Typography>
        <div className={classes.basketPrice}>
          <Typography variant="caption">
            {getCurrencyDisplayWithPrice(
              (parseFloat(basket?.total_price) - deliveryFeePrice).toFixed(2),
            )}
          </Typography>
          {isFullyPaid && (
            <WarningIcon className={classes.basketPriceWarning} />
          )}
        </div>
      </div>
    </div>
  );
};

type Props = {
  basketList?: Array<Basket>;
  memberById: { [memberId: number]: Member };
  selectedBasket?: Basket;
  onBasketAdd: () => void;
  onBasketClick: (basket: Basket) => void;
};

const QuicksaleBasketListBar: React.FC<Props> = ({
  basketList,
  memberById,
  selectedBasket,
  onBasketAdd,
  onBasketClick,
}) => {
  const classes = useStyles({});

  const orderedBasketList = React.useMemo(() => {
    if (basketList) return sortByDate(basketList, 'date_updated', true);
    return [];
  }, [basketList]);

  return (
    <div className={classes.container}>
      <IconButton className={classes.addBasketButton} onClick={onBasketAdd}>
        <AddIcon />
      </IconButton>

      <Divider flexItem orientation="vertical" />

      <div className={classes.basketListContainer}>
        {orderedBasketList.map((basket) => (
          <BasketChip
            key={basket.id}
            basket={basket}
            isFullyPaid={!!basket.invoice && !basket.is_fully_paid}
            isSelected={basket.id === selectedBasket?.id}
            member={memberById[basket.member]}
            onClick={onBasketClick}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(QuicksaleBasketListBar);
