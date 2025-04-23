import { Button } from "@bsport/kaizen-primitive-core";
import { getAuthToken } from "@bsport/local-storage-auth-token";
import { logout } from "@bsport/store-auth";

const Logout: React.FC = () => {
  return (
    <Button
      onClick={() => logout()}
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
