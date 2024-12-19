import { getEnv } from './env';
import { migrateOldProps, WidgetConfig } from './widget-props';

export const logWidgetConfigUsage = (widgetId: string, data: WidgetConfig) => {
  const sanitizedData = {
    widgetId,
    ...migrateOldProps(data),
    companyId: data?.companyId || -1,
    franchiseId: data?.franchiseId || -1,
  };
  fetch(
    `${
      getEnv().REACT_APP_BASE_URI
    }/api/v1/marketplace_settings/widget_config/log/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referer: window.location.href,
      },
      redirect: 'follow',
      body: JSON.stringify(sanitizedData),
    },
  );
};
