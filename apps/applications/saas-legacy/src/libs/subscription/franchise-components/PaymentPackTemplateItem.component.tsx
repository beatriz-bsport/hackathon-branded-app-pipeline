import React from 'react';
import { useTranslation } from 'react-i18next';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import ListItemResponsiveAction from '#src/components/button/ListItemResponsiveAction.component';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import { getValidityInfo } from '#src/libs/payment-packs/utils';

import type { PaymentPackTemplate } from '#src/libs/payment-packs/types';

type Props = {
  paymentPackTemplate: PaymentPackTemplate;
  onClick: (id: number) => void;
};

const PaymentPackTemplateItem: React.FC<Props> = ({
  paymentPackTemplate,
  onClick,
}) => {
  const { t } = useTranslation('paymentPack');

  const dateInfo = React.useMemo(
    () => getValidityInfo(paymentPackTemplate, t),
    [paymentPackTemplate, t],
  );

  const handleClick = React.useCallback(() => {
    onClick(paymentPackTemplate.id);
  }, [onClick, paymentPackTemplate.id]);

  const actions = React.useMemo(
    () => [
      {
        icon: RemoveRedEye,
        color: 'primary',
        onClick: handleClick,
      },
    ],
    [handleClick],
  );

  const priceDisplay = React.useMemo(
    () => getCurrencyDisplayWithPrice(paymentPackTemplate.price),
    [paymentPackTemplate.price],
  );

  return (
    <ListItem button divider onClick={handleClick}>
      <ListItemText
        primary={paymentPackTemplate.name}
        secondary={`${
          !paymentPackTemplate.unlimited
            ? t('specifications.nbCredits', {
                count: paymentPackTemplate.credits,
                credits: paymentPackTemplate.credits,
              })
            : t('specifications.unlimitedCredits')
        } - ${priceDisplay}${` - ${dateInfo}`}`}
      />
      <ListItemResponsiveAction
        // @ts-expect-error
        actions={actions}
      />
    </ListItem>
  );
};

export default React.memo(PaymentPackTemplateItem);
