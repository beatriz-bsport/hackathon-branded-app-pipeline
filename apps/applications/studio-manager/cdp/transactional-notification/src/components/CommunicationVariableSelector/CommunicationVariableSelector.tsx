import {
  Autocomplete,
  type TextFieldProps,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { useFetchCommunicationVariables } from "./use-fetch-communication-variables";
import { useFormatCommunicationVariableItems } from "./use-format-communication-variable-items";

type CommunicationVariableSelectorProps = {
  id: string;
  onSelectCommunicationVariable: (value: string) => void;
  textfieldProps?: TextFieldProps;
  fullWidth?: boolean;
};

export const CommunicationVariableSelector: React.FC<
  CommunicationVariableSelectorProps
> = ({
  id,
  textfieldProps,
  fullWidth = false,
  onSelectCommunicationVariable,
}: CommunicationVariableSelectorProps) => {
  const { t } = useTranslation("communicationVariables");
  const { communicationVariables } = useFetchCommunicationVariables();
  const { formattedItems } = useFormatCommunicationVariableItems({
    communicationVariables,
  });

  return (
    <Autocomplete
      id={id}
      items={formattedItems}
      fullWidth={fullWidth}
      textfieldProps={{
        id: "communication-variable-selector",
        fullWidth: true,
        iconRight: "chevron-down",
        placeholder: t("communicationVariableSelector.placeholder"),
        ...textfieldProps,
      }}
      onSelect={(item) => {
        const communicationVariableData = item.split("-");
        if (communicationVariableData.length !== 2) {
          return;
        }
        const interpolatedValue = `{ ${communicationVariableData[1]} }`;
        onSelectCommunicationVariable(interpolatedValue);
      }}
    />
  );
};
