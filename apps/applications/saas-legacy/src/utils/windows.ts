import { STORAGE_KEY_BSPORT_IMPERSONATED_ORIGIN_URL } from '#src/actions/constants';
import { setItemInStorage, storageToString } from './storage';
import { getBaseURL } from './urlUtils';

function openNewBackOfficeWindow(urlToImpersonate: string) {
  const baseUrl = getBaseURL();
  const searchParams = new URLSearchParams();

  const stringifiedSessionStorage = storageToString('session');
  searchParams.append('purpose', 'subwindow');
  searchParams.append('goto_url', urlToImpersonate);
  searchParams.append('session_storage', stringifiedSessionStorage);

  window.open(`${baseUrl}/new-window?${searchParams.toString()}`, '_blank');
}

function openNewWindowToImpersonate(
  companyId: number,
  urlToImpersonate: string,
) {
  const baseUrl = getBaseURL();
  const originUrl = window.location.href
    .toString()
    .split(window.location.host)[1];
  const searchParams = new URLSearchParams();

  searchParams.append('purpose', 'impersonate');
  searchParams.append('goto_url', urlToImpersonate);
  searchParams.append('company_id', companyId.toString());
  setItemInStorage(
    'session',
    STORAGE_KEY_BSPORT_IMPERSONATED_ORIGIN_URL,
    originUrl,
  );

  window.open(`${baseUrl}/new-window?${searchParams.toString()}`, '_blank');
}

export { openNewBackOfficeWindow, openNewWindowToImpersonate };
