import type { Editor } from "react-email-editor";

type ExportDesignResults = {
  design: string | null;
  html: string;
};

export const useUnlayerBuilder = () => {
  const exportEmailBuilderTemplate = ({
    emailBuilderRef,
  }: {
    emailBuilderRef: Editor;
  }): Promise<ExportDesignResults | null> => {
    return new Promise((resolve, reject) => {
      try {
        emailBuilderRef.exportHtml(({ design, html }) => {
          // The base config of the design is a blank design with only counters for 1 row and 1 column.
          // When we set the initial value of the design we are urged to set it to null if it is a blank design.
          // This cause discrepancies we manage the email template design values as the base value of unlayer is a complex object and is not set to null.
          // This way this allow us to match the initial value that we set ourselves on the form for a blank design and the real bland design value of unlayer.
          const isBlankDesign =
            design?.counters &&
            Object.keys(design.counters).length === 2 &&
            "u_row" in design.counters &&
            "u_column" in design.counters;
          const stringifiedDesign =
            isBlankDesign || !design ? null : JSON.stringify(design);
          resolve({ design: stringifiedDesign, html });
        });
      } catch (error) {
        console.error(
          "Failed to export email template from the builder:",
          error,
        );
        reject(error);
      }
    });
  };

  const initializeUnlayerBuilder = ({
    emailBuilderRef,
    initialDesign,
  }: {
    emailBuilderRef: Editor;
    initialDesign: string | null;
  }) => {
    try {
      const templateToLoad = initialDesign ? JSON.parse(initialDesign) : null;
      if (!templateToLoad) {
        emailBuilderRef.loadBlank();
      } else {
        emailBuilderRef.loadDesign(templateToLoad);
      }
    } catch (error) {
      console.error("Failed to load email template in the builder:", error);
    }
  };
  return {
    initializeUnlayerBuilder,
    exportEmailBuilderTemplate,
  };
};
