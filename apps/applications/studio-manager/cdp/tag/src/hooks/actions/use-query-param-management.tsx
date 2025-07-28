import { useSearchParams } from "react-router";

export function useDrawerQueryParam(paramName = "tagDetail") {
  const [searchParams, setSearchParams] = useSearchParams();

  // The item ID (or name) whose details drawer is open, or null if none
  const openId = searchParams.get(paramName);

  // Call this to open the drawer for a given ID
  const openDrawer = (id: string | number) => {
    const next = new URLSearchParams(searchParams);
    next.set(paramName, String(id));
    next.set("page", "1"); // Clear the page param to reset pagination
    next.set("page_size", "10"); // Clear the pageSize param to reset pagination
    setSearchParams(next, { replace: true });
  };

  // Call this to close the drawer
  const closeDrawer = () => {
    const next = new URLSearchParams(searchParams);
    next.delete(paramName);
    next.delete("page"); // Clear the page param
    next.delete("page_size"); // Clear the pageSize param
    setSearchParams(next, { replace: true });
  };

  return { openId, openDrawer, closeDrawer };
}
