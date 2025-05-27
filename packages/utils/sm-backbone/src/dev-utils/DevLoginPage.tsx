import { type ChangeEvent, useState } from "react";
import { useNavigate } from "react-router";

import { Button, TextField } from "@bsport/kaizen-primitive-core";
import { loginAction } from "@bsport/store-auth";

import { fetch } from "#src/utils/fetch";

function DevLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    const response = await loginAction(fetch, { email, password });
    response.fold(() => {
      navigate("/", { replace: true });
    }, console.error);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col justify-center items-center p-md rounded-md shadow-md">
        <TextField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          onClear={() => setEmail("")}
          required
          placeholder="Enter your email"
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          onClear={() => setPassword("")}
          required
          placeholder="Enter your password"
        />
        <Button
          onClick={handleLogin}
          label="Login"
          color="main"
          intent="call-to-action"
          size="md"
          className="mt-4"
        />
      </div>
    </div>
  );
}

export default DevLoginPage;
