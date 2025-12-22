import { handleAPIMessages } from "./handlers/apiProxyHandler";
import { handleAuthenticationMessages } from "./handlers/authenticationHandler";

handleAPIMessages();
handleAuthenticationMessages();
