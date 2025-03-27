import type { i18n } from "i18next";
import React from "react";
import { I18nextProvider } from "react-i18next";

export const getAppI18nextProvider = (i18nInstance: i18n) => {
  const AppI18nextProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
  };
  return { AppI18nextProvider };
};
