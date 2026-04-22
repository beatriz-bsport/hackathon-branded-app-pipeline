import React, { useState } from 'react';

import { ButtonBase } from '@material-ui/core';
import { makeStyles } from '@bsport/saas-legacy/node_modules/@material-ui/core/styles';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import {
  PrivateServiceSelectorDataProvider,
  PrivateServiceSelectorPage,
} from '@bsport/saas-legacy/src/pages/marketplace/PrivateService/PrivateServiceSelectorPage/PrivateServiceSelector.page';

import {
  SlotSelectorDataProvider,
  SlotSelectorPageWithContext,
} from '@bsport/saas-legacy/src/pages/marketplace/PrivateService/SlotSelectorPage/SlotSelector.page';

import {
  PrivateService,
  PrivateSlot,
} from '@bsport/saas-legacy/src/libs/private-service/types';
import themify from '@bsport/saas-legacy/src/hocs/company-themifier.hoc';
import { getEnv } from '../utils/env';
import { CompanyTheme } from '@bsport/saas-legacy/src/libs/theme/types';
import {
  MarketplacePrivateServiceData,
  MarketplacePrivateServiceSessionData,
  MarketplacePrivateServiceTypeEnum,
} from '@bsport/saas-legacy/src/libs/marketplace/types';
import { useWidgetDataVersion } from '../libs/widget/hooks';

const PrivateServiceSelector = themify(
  PrivateServiceSelectorDataProvider(PrivateServiceSelectorPage),
);
const SlotSelector = themify(
  SlotSelectorDataProvider(SlotSelectorPageWithContext),
);

type Props = {
  companyId: number;
  config: MarketplacePrivateServiceData;
  store: any;
  theme: CompanyTheme;
  onWindowOpen: (url: string) => void;
  dialogMode: number;
};

const PrivateServiceWidget: React.FC<Props> = ({
  config,
  companyId,
  onWindowOpen,
  store,
  theme,
}) => {
  const [type, setType] = useState<MarketplacePrivateServiceTypeEnum>(
    config.type,
  );
  const [serviceId, setServiceId] = useState<number | null>(config.serviceId);
  const classes = useStyles();
  const dataVersion = useWidgetDataVersion();

  const onClickPrivateService = (ps: PrivateService) => {
    setType(MarketplacePrivateServiceTypeEnum.detail);
    setServiceId(ps.id);
  };

  const onSessionSelect = (
    data: MarketplacePrivateServiceSessionData,
    privateSlot: PrivateSlot,
  ) => {
    const { PUBLIC_URL } = getEnv();
    const url = `${PUBLIC_URL}/customer/payment/private-service/${serviceId}/private-slot/${
      privateSlot.id
    }/?membership=${companyId}&data=${encodeURIComponent(
      JSON.stringify(data),
    )}`;

    onWindowOpen(url);
  };

  const backToListView = () => {
    setType(MarketplacePrivateServiceTypeEnum.list);
    setServiceId(undefined);
  };

  return (
    <div className={classes.container}>
      {type === MarketplacePrivateServiceTypeEnum.list && (
        <PrivateServiceSelector
          key={`private-service-list-${dataVersion}`}
          companyId={companyId.toString()}
          companyName=""
          onClickPrivateService={onClickPrivateService}
          store={store}
          theme={theme}
          filters={{ private_service_group: config.privateGroups }}
        />
      )}

      {type === MarketplacePrivateServiceTypeEnum.detail && serviceId && (
        <div className={classes.detailContainer}>
          {config.type === MarketplacePrivateServiceTypeEnum.list && (
            <ButtonBase onClick={backToListView}>
              <ChevronLeftIcon className={classes.icon} fontSize="large" />
            </ButtonBase>
          )}
          <SlotSelector
            key={`private-service-slots-${dataVersion}`}
            companyId={companyId.toString()}
            serviceId={serviceId.toString()}
            onSessionSelect={onSessionSelect}
            hideDetailSummary
            store={store}
            theme={theme}
          />
        </div>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  detailContainer: {
    width: '100%',
  },
  icon: {
    marginLeft: theme.spacing(2),
  },
}));

export default React.memo(PrivateServiceWidget);
