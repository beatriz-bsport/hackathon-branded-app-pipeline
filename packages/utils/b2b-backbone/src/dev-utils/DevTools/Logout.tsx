import { logout } from "@bsport/store-auth";
import { Button } from "@bsport/kaizen-primitive-core";

const Logout: React.FC = () => {
  return (
    <Button
      onClick={() => logout()}
      color="critical"
      intent="call-to-action"
      size="md"
      label="Logout"
      className="w-fit"
    />
  );
};
export default Logout;
