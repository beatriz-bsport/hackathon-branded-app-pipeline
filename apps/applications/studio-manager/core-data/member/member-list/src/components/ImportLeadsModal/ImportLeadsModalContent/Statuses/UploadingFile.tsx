import React, { useState } from "react";

import {
  Body,
  FILE_UPLOAD_STATUSES,
  FileUpload,
  Link,
} from "@bsport/kaizen-primitive-core";
import { importLeadsAction } from "@bsport/store-core-data-member";

import { xhr } from "#src/utils/fetch";
import { Trans, useTranslation } from "#src/utils/i18n";

import { LEAD_MANAGEMENT_ERRORS } from "../constants";

const TEMPLATE_CSV_URL =
  "https://bsport-953e1d91253a.intercom-attachments-2.com/i/o/q6foivp2/1430317703/52ec4ff949888ec4493e877bd6bf/Template+import+leads.csv?expires=1747142100&signature=40c4cfa31eab37d3a0e3ebf560f99817a886f40fcba61921c2624b33661c47dd&req=dSQkFsp%2FmoZfWvMW1HO4zZoyoeQgC%2BLi4G3j6sbwlHsC5OMJ9IJK5WrAnukq%0ACzOZAbsgbT8%3D%0A";

type UploadingFileProps = {
  handleProcessTask: (backgroundTaskUuid: string) => void;
};

export const UploadingFile: React.FC<UploadingFileProps> = ({
  handleProcessTask,
}) => {
  const { t } = useTranslation("common");

  const [displayFormatIndication, setDisplayFormatIndication] = useState(false);

  const handleUploadFile = async (
    file: File,
    signal: AbortSignal,
    onUploadProgress: (progress: ProgressEvent) => void,
  ) => {
    const response = await importLeadsAction(xhr, {
      file,
      signal,
      onUploadProgress,
    });

    return response.fold(
      (value) => {
        // If upload succeded, retrieved the background task uuid
        const { backgroundTaskUuid } = value;

        setTimeout(() => {
          handleProcessTask(backgroundTaskUuid);
        }, 500);

        // Return a status "success" to update state of the progress bar
        return { status: FILE_UPLOAD_STATUSES.success };
      },
      (error) => {
        const errorMessages: string[] = [];
        if (error.statusCode === 499) {
          const errorCodes = error.customErrorCodes;
          if (
            errorCodes.includes(LEAD_MANAGEMENT_ERRORS.MAXIMUM_NUMBER_OF_ROWS)
          ) {
            errorMessages.push(
              t("importLeadsModal.uploadFile.errors.datasetTooLarge"),
            );
          }
          if (
            errorCodes.includes(LEAD_MANAGEMENT_ERRORS.WRONG_NUMBER_OF_COLUMN)
          ) {
            errorMessages.push(
              t(
                "importLeadsModal.uploadFile.errors.wrongNumberOfColumns.title",
              ),
            );
            setDisplayFormatIndication(true);
          }
          if (errorCodes.includes(LEAD_MANAGEMENT_ERRORS.WRONG_ENCODING)) {
            errorMessages.push(
              t("importLeadsModal.uploadFile.errors.wrongEncoding"),
            );
          }
        }
        return {
          status: FILE_UPLOAD_STATUSES.error,
          customMessage: errorMessages.join("\n"),
        };
      },
    );
  };

  return (
    <>
      <FileUpload
        id="file-upload-leads"
        fileExtensionList={["csv"]}
        multiple={false}
        autoUpload
        handleUploadFile={handleUploadFile}
        className="w-full"
        customTexts={{
          fileExtensionList: t("importLeadsModal.uploadFile.extensionCSVOnly"),
        }}
      />
      {displayFormatIndication && (
        <Body size="sm" className="mx-md">
          <Trans
            i18nKey="importLeadsModal.uploadFile.errors.wrongNumberOfColumns.formatIndication"
            components={{
              key: (
                <Link
                  href={TEMPLATE_CSV_URL}
                  download={"Template import leads.csv"}
                  isUnderlined
                  color="main"
                />
              ),
            }}
          />
        </Body>
      )}
    </>
  );
};
