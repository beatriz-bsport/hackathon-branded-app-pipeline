import { toast } from "@bsport/kaizen-primitive-core";

import { navigateToReports } from "#src/urls";

export const copyPayoutIdToClipboard = async (
  payoutId: string,
  {
    successDescription,
    failureDescription,
  }: { successDescription: string; failureDescription: string },
) => {
  const writePromise = navigator?.clipboard?.writeText(payoutId);

  try {
    if (writePromise === undefined) {
      throw new Error("Clipboard unavailable");
    }

    await writePromise;

    toast({
      status: "default",
      icon: "copy-07",
      description: successDescription,
      buttonIcon: "link-external-02",
      onButtonClick: () => navigateToReports(),
    });
  } catch {
    toast({
      status: "critical",
      description: failureDescription,
    });
  }
};
