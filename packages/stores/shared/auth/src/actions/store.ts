import { authStore } from "#src/store";
import type { UserAccess } from "#src/types";

export const updateUserAccess = (userAccess: UserAccess) => {
  authStore.setState(() => {
    return { userAccess };
  });
};
