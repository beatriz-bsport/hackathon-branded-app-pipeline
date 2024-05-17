import React, { useCallback, useState } from 'react';
import { fakerEN as faker } from '@faker-js/faker';
import { useTranslation } from 'react-i18next';

import Blanket from '.';
import Button from '#Fabrique/ButtonV2';
import Card from '#Fabrique/Card';

// @ts-expect-error
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import BlanketCss from '!!raw-loader!./styles.css';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplacePage,
  type MarketplaceCSSComponentConfig,
} from '#libs/exportable-components/types';

const BLANKET_TEXT = faker.lorem.sentence();

export const FABRIQUE_BLANKET_CONFIGURATION: MarketplaceCSSComponentConfig = {
  label: CssComponentsVariantIdentifiers.FABRIQUE_BLANKET,
  css: BlanketCss,
  pages: [MarketplacePage.FABRIQUE],
  defaultState: {},
  variations: [],
};

export const FABRIQUE_BLANKET_PREVIEW: React.FC = React.memo(() => {
  const [showBlanket, setShowBlanket] = useState(false);
  const { t } = useTranslation('widget');
  const handleShowBlanket = useCallback(
    () => setShowBlanket((state) => !state),
    [],
  );
  return (
    <div>
      <Button
        color="primary"
        onClick={handleShowBlanket}
        size="md"
        variant="contained"
      >
        {t('widget:widget.cssConfig.title.showBlanket')}
      </Button>
      <Blanket
        className="bs-fabrique-blanket-container"
        isOpen={showBlanket}
        onClick={handleShowBlanket}
      >
        <Card>{BLANKET_TEXT}</Card>
      </Blanket>
    </div>
  );
});
