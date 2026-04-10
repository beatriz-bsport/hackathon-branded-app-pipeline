import { first } from "lodash";

export const getMemberInitials = ({
  firstname,
  lastname,
}: {
  firstname?: string;
  lastname?: string;
}): string => {
  const firstInitial = first(firstname ?? "") ?? "";
  const lastInitial = first(lastname ?? "") ?? "";
  return `${firstInitial}${lastInitial}`;
};
