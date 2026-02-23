import { useParams } from "react-router";

/**
 * Retrieve id from route params
 */
export const useRetrieveId = () => {
  const { id } = useParams();

  const parsedId = id && /^\d+$/.test(id) ? Number(id) : undefined;

  return parsedId;
};
