export function urlToMarketplace(companyName: string, companyId: string) {
  return `/m/${encodeURI(companyName)}/${companyId}`;
}

export function urlToMarketplaceTab(
  companyName: string,
  companyId: string,
  path: string,
) {
  return `${urlToMarketplace(companyName, companyId)}/${path}`;
}
