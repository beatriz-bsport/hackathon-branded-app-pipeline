import React, { useEffect } from "react";
import { LOGIN_URL } from "@bsport/store-auth";
import { getAuthToken } from "@bsport/local-storage-auth-token";

interface AuthWrapperProps {
  children: React.ReactNode;
}

/**
 * Simple wrapper component to check if a token is present and redirect to the login page if not.
 */
const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const token = getAuthToken();

  useEffect(() => {
    if (!token) {
      window.location.href = LOGIN_URL;
    }
  }, [token]);

  return <>{children}</>;
};

export default AuthWrapper;
