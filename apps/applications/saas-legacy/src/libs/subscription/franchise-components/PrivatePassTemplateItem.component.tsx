import React from 'react';

import { useTranslation } from 'react-i18next';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import ListItemResponsiveAction from '#src/components/button/ListItemResponsiveAction.component';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import { getValidityInfo } from '#src/libs/private-service/utils';

import type { PrivatePassTemplate } from '#src/libs/private-service/types';

type Props = {
  privatePassTemplate: PrivatePassTemplate;
  onClick?: (id: number) => void;
};

const PrivatePassTemplateItem: React.FC<Props> = ({
  privatePassTemplate,
  onClick,
}) => {
  const { t } = useTranslation('privateService');

  const dateInfo = React.useMemo(
    () => getValidityInfo(privatePassTemplate, t),
    [privatePassTemplate, t],
  );

  const handleClick = React.useCallback(() => {
    onClick(privatePassTemplate.id);
  }, [onClick, privatePassTemplate.id]);

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
    () => getCurrencyDisplayWithPrice(privatePassTemplate.price),
    [privatePassTemplate.price],
  );

  return (
    <ListItem button divider onClick={!!onClick && handleClick}>
      <ListItemText
        primary={privatePassTemplate.name}
        secondary={`${t('privatePass.parameters.nbCredits', {
          count: privatePassTemplate.credits,
          credits: privatePassTemplate.credits,
        })} - ${priceDisplay}${` - ${dateInfo}`}`}
      />
      <ListItemResponsiveAction
        // @ts-expect-error
        actions={actions}
      />
    </ListItem>
  );
};

export default React.memo(PrivatePassTemplateItem);
