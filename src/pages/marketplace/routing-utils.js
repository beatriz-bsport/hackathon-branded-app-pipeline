// @flow
//
export const getMarketplaceRoute = (
  companyName: string,
  companyId: number,
  tab: string,
) => `/m/${(companyName || '-').replace(/ /g, '-')}/${companyId}/${tab || ''}`;
