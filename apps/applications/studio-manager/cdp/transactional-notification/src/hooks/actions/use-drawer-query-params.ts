import { useSearchParams } from "react-router";

export function useDrawerQueryParam(paramName = "notificationEvent") {
  const [searchParams, setSearchParams] = useSearchParams();

  // The item ID (or name) whose details drawer is open, or null if none
  const openId = searchParams.get(paramName);

  // Call this to open the drawer for a given ID
  const openDrawer = (id: number) => {
    const next = new URLSearchParams(searchParams);
    next.set(paramName, String(id));
    setSearchParams(next, { replace: true });
  };

  // Call this to close the drawer
  const closeDrawer = () => {
    const next = new URLSearchParams(searchParams);
    next.delete(paramName);
    setSearchParams(next, { replace: true });
  };

  return { openId, openDrawer, closeDrawer };
}
