import { type ChangeEvent, useState } from "react";

import { Body, Button, TextField } from "@bsport/kaizen-primitive-core";
import { getIsLoggedIn, loginAction } from "@bsport/store-auth";

import { fetch } from "#src/utils/fetch";

/**
 * A component to login in the standalone Navigation sidebar
 */
export const StandaloneAuthentifier = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  /** @todo Use broadcast channel to synchronize this state from local storage */
  const [isLoggedIn, setIsLoggedIn] = useState(getIsLoggedIn);

  const handleLogin = async () => {
    const response = await loginAction(fetch, { email, password });
    response.fold(() => {
      setIsLoggedIn(getIsLoggedIn);
      setEmail("");
      setPassword("");
    }, console.error);
  };

  //!! Refresh is login when loggin out :o broadcast channel ?

  if (isLoggedIn)
    return (
      <Body htmlVariant="p" className="p-md" weight="strong">
        You are logged in !
      </Body>
    );

  return (
    <div className="flex flex-col justify-center items-center gap-sm p-md rounded-md shadow-md w-[240px]">
      <Body htmlVariant="p" weight="strong">
        You are not logged in !
      </Body>
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
        className="w-full"
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
  );
};
