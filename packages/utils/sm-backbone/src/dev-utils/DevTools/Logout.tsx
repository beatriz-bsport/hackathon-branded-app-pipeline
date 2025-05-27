import { useNavigate } from "react-router";

import { Button } from "@bsport/kaizen-primitive-core";
import { getAuthToken } from "@bsport/local-storage-auth-token";
import { LOGIN_URL, logoutAction } from "@bsport/store-auth";

const Logout: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => logoutAction(() => navigate(LOGIN_URL))}
      color="critical"
      intent="call-to-action"
      size="md"
      label="Logout"
      className="w-fit"
      disabled={!getAuthToken()}
    />
  );
};
export default Logout;
