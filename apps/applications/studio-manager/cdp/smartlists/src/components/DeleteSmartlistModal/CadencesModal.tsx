import { Body, Illustration, Modal } from "@bsport/kaizen-primitive-core";

import { useCadences } from "#src/api/use-cadences";
import { useTranslation } from "#src/utils/i18n";

type CadencesModalProps = {
  isOpen: boolean;
  cadenceIds: number[];
  onClose: () => void;
};

export const CadencesModal: React.FC<CadencesModalProps> = ({
  isOpen,
  onClose,
  cadenceIds,
}: CadencesModalProps) => {
  const { t } = useTranslation("list");

  const { cadences } = useCadences({ ids: cadenceIds });

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
        <Body htmlVariant="p" size="lg" color="default" weight="weak">
          {t("deleteModal.audienceCallToAction")}
        </Body>
      </div>
    </Modal>
  );
};
