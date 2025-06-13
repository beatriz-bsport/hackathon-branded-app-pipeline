import { useCallback } from "react";
import { useNavigate } from "react-router";

/**
 * Hook to abstract the logic when clicking on an "Add member" button
 */
export const useAddMember = () => {
  const navigate = useNavigate();

  const handleAddMember = useCallback(() => {
    navigate("/member/add");
  }, [navigate]);

  return { handleAddMember };
};
