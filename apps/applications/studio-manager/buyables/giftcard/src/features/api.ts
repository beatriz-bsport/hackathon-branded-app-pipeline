/** @todo Use companytheme store once created */
import type { Dispatch, SetStateAction } from "react";

import { fetch } from "#src/utils/fetch";

/**
 * Retrieve Company theme
 */
export async function getCompanyTheme({
  setTheme,
}: {
  setTheme: Dispatch<SetStateAction<{ cover: string }>>;
}) {
  try {
    const { data } = await fetch<{ cover: string }>("api/v1/company/theme/me/");
    setTheme(data);
  } catch (error) {
    console.error(error);
  }
}
