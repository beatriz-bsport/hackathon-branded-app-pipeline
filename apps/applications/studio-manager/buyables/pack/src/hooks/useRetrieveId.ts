import { useParams } from "react-router";

/**
 * Retrieve id from query params
 */
export const useRetrieveId = () => {
  const { id } = useParams();
  const parsedId = id ? parseInt(id, 10) : undefined;
  return parsedId && !isNaN(parsedId) ? parsedId : undefined;
};
