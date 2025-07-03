import { authStore } from "#src/store";
import type { TemporaryPassword, UserAccess } from "#src/types";

export const updateUserAccess = (userAccess: UserAccess) => {
  authStore.setState(() => {
    return { userAccess };
  });
};

export const updateRevampedBackofficeEnabled = (nextValue: boolean) => {
  authStore.setState((state) => {
    return {
      userAccess: {
        ...(state.userAccess as UserAccess),
        has_enabled_revamped_backoffice: nextValue,
      },
    };
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
