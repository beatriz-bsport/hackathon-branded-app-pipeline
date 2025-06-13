import { authStore } from "#src/store";
import type { TemporaryPassword, UserAccess } from "#src/types";

export const updateUserAccess = (userAccess: UserAccess) => {
  authStore.setState(() => {
    return { userAccess };
  });
};

export const updateTemporaryPassword = (
  temporaryPassword: TemporaryPassword,
) => {
  authStore.setState(() => {
    return {
      temporaryPassword: {
        expirationDate: temporaryPassword.expiration_date,
        password: temporaryPassword.password,
      },
    };
  });
};
