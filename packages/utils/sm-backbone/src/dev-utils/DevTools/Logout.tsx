import React from "react";
import { useNavigate } from "react-router";

import { Button } from "@bsport/kaizen-primitive-core";
import { getAuthToken } from "@bsport/local-storage-auth-token";
import { LOGIN_URL, logoutAction } from "@bsport/store-auth";

export type LogoutProps = {
  onLogoutCallback?: () => void;
};

const Logout: React.FC<LogoutProps> = ({ onLogoutCallback }) => {
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => {
        onLogoutCallback?.();
        logoutAction(() => navigate(LOGIN_URL));
      }}
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
