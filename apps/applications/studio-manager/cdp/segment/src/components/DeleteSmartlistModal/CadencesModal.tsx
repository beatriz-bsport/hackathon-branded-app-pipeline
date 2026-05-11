import {
  Body,
  Illustration,
  Loader,
  Modal,
} from "@bsport/kaizen-primitive-core";

import { useCadences } from "#src/api/use-cadences";
import { useCadencesInSmartlist } from "#src/api/use-cadences-in-smartlist";
import { useTranslation } from "#src/utils/i18n";

type CadencesModalProps = {
  isOpen: boolean;
  smartlistId: number;
  onClose: () => void;
};

export const CadencesModal: React.FC<CadencesModalProps> = ({
  isOpen,
  onClose,
  smartlistId,
}: CadencesModalProps) => {
  const { t } = useTranslation("list");

  // First, get the cadence IDs for this smartlist
  const { cadenceIds, isLoading: isLoadingCadenceIds } = useCadencesInSmartlist(
    {
      smartlistId,
    },
  );

  // Then, get the cadence details using those IDs
  const { cadences, isLoading: isLoadingCadences } = useCadences({
    ids: cadenceIds,
  });

  const isLoading = isLoadingCadenceIds || isLoadingCadences;

  return (
    <Modal
      open={isOpen}
      title={t("deleteModal.title")}
      size="md"
      onClickOutside={onClose}
      onClose={onClose}
    >
      <div className="flex flex-col">
        <Illustration name="error" className="self-center mb-md" />
        <Body
          htmlVariant="p"
          size="lg"
          color="default"
          weight="weak"
          className="mb-xs"
        >
          {t("deleteModal.cannotBeDeleted")}
        </Body>
        {isLoading ? (
          <div className="flex justify-center mb-xl">
            <Loader size="md" />
          </div>
        ) : (
          <ul className="list-disc pl-lg mb-xl">
            {cadences.map((cadence) => (
              <li key={cadence.id}>
                <Body
                  htmlVariant="span"
                  size="lg"
                  color="default"
                  weight="stronger"
                >
                  {cadence.name}
                </Body>
              </li>
            ))}
          </ul>
        )}
        <Body htmlVariant="p" size="lg" color="default" weight="weak">
          {t("deleteModal.audienceCallToAction")}
        </Body>
      </div>
    </Modal>
  );
};
