import React, { useState } from 'react';
import { compose } from 'recompose';
import { withStyles } from '@bsport/saas-legacy/node_modules/@material-ui/core/styles';
import type {
  Theme,
  WithStyles,
} from '@bsport/saas-legacy/node_modules/@material-ui/core/styles';

import { MarketplaceWorkshopBase } from '@bsport/saas-legacy/src/pages/marketplace/MarketplaceWorkshop.page';
import { OwnProps as MarketplaceWorkshopOwnProps } from '@bsport/saas-legacy/src/pages/marketplace/MarketplaceWorkshop.page';
import type {
  MarketplaceFilters,
  MarketplaceWorkshopData,
} from '@bsport/saas-legacy/src/libs/marketplace/types';
import type { CompanyTheme } from '@bsport/saas-legacy/src/libs/theme/types';
import themify from '@bsport/saas-legacy/src/hocs/company-themifier.hoc';
import withPostMessageOnPropsUpdate from '@bsport/saas-legacy/src/hocs/postMessages/with-post-message-on-props-update';
import withPostMessageToUpdateProps from '@bsport/saas-legacy/src/hocs/postMessages/with-post-message-to-update-props';
import {
  CalendarFilterValidationSchema,
  CalendarOnlineFilterValidationSchema,
} from '@bsport/saas-legacy/src/libs/marketplace/utils';

import '../../vendor/map.css';

import { getEnv } from '../utils/env';

type MarketplaceWorkshopStyledProps = MarketplaceWorkshopOwnProps & {
  theme: CompanyTheme;
};

const MarketplaceWorkshopBaseStyled = compose<
  MarketplaceWorkshopOwnProps,
  MarketplaceWorkshopStyledProps
>(
  themify,
  withPostMessageOnPropsUpdate([
    { propName: 'filters', messageType: 'bsport:calendar:filter:update' },
    {
      propName: 'onlineFilter',
      messageType: 'bsport:calendar:filter:update',
    },
  ]),
  withPostMessageToUpdateProps([
    {
      propName: 'filters',
      messageType: 'bsport:calendar:filter:control',
      validationSchema: CalendarFilterValidationSchema,
    },
    {
      propName: 'onlineFilter',
      messageType: 'bsport:calendar:filter:control',
      validationSchema: CalendarOnlineFilterValidationSchema,
    },
  ]),
)(MarketplaceWorkshopBase);

type OwnProps = {
  companyId: number;
  config: MarketplaceWorkshopData;
  store: any;
  theme: CompanyTheme;
  username: string;
  onWindowOpen: (url: string) => void;
};

type Props = OwnProps & WithStyles<typeof styles>;

type State = {
  filters: MarketplaceFilters;
};

const WorkshopWidget = (props: Props) => {
  const { onWindowOpen, config, classes, store, theme, companyId } = props;
  const [filters, setFilters] = useState<MarketplaceFilters>({
    coaches: config.coaches || [],
    establishments: config.establishments || [],
    activity__in: config.metaActivities || [],
    levels: config.levels || [],
    establishment_group__in: config.establishmentGroups || [],
  });

  const updateFilters = (filtersUpdate: Partial<MarketplaceFilters>) =>
    setFilters({ ...filters, ...filtersUpdate });

  const goToBook = (id: number, companyId: number) => {
    const { PUBLIC_URL } = getEnv();
    const url = `${PUBLIC_URL}/customer/payment/offer/${id}?membership=${companyId}`;
    onWindowOpen(url);
  };

  return (
    <div className={classes.container}>
      <MarketplaceWorkshopBaseStyled
        {...props}
        companyId={companyId}
        filters={filters}
        setFilters={updateFilters}
        goToBook={goToBook}
        store={store}
        theme={theme}
        mapContainerClassName="cleanslate"
      />
    </div>
  );
};

const styles = (theme: Theme) => ({
  container: {
    width: '100%',
    fontFamily: theme.typography.fontFamily,
  },
});

export default compose<Props, OwnProps>(withStyles(styles))(WorkshopWidget);
