/**
 * Shared fetch instance for Storybook only (devDependency).
 * Initialized once and used by stories that need to inject fetch into components.
 * Not exported from the package index — not included in the library bundle.
 */
import { getFetch } from "@bsport/fetch";

const fetch = getFetch();

export default fetch;
