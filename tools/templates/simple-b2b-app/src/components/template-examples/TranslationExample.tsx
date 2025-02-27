import React from "react";
import {
  FileUpload,
  FILE_UPLOAD_STATUSES,
} from "@bsport/kaizen-primitive-core";
import {
  useTranslation,
  withTranslation,
  type TFunction,
  getFixedNamespace,
} from "#src/utils/i18n";

const SingleNamespaceWithHook: React.FC = () => {
  const { t } = useTranslation("namespaceAlpha");
  return (
    <p>
      This is a translation with a single namespace using useTranslation :<br />
      {t("helloWorld")}
    </p>
  );
};

const _SingleNamespaceWithHoc: React.FC<{ t: TFunction }> = ({ t }) => {
  return (
    <p>
      This is a translation with a single namespace using withTranslation :
      <br />
      {t("helloWorld")}
    </p>
  );
};

const SimpleTranslationWithHoc = withTranslation("namespaceAlpha")(
  _SingleNamespaceWithHoc,
);

const MultipleNamespacesWithHook: React.FC = () => {
  const { t } = useTranslation(["namespaceAlpha", "namespaceBeta"]);
  return (
    <div>
      <p>
        These are translations from multiple namespaces using useTranslation :
      </p>
      <ul>
        <li>{t("helloWorld", { ns: "namespaceAlpha" })}</li>
        <li>{t("nested.item1", { ns: "namespaceBeta" })}</li>
        <li>{t("nested.item2", { ns: "namespaceBeta" })}</li>
      </ul>
    </div>
  );
};

const _MultipleNamespacesWithHoc: React.FC<{ t: TFunction }> = ({ t }) => {
  return (
    <div>
      <p>
        Translations from multiple namespaces using withTranslation are not
        configured the same way
        <br />
        You must manually prefix namespaces with the application name.
      </p>
      <ul>
        <li>{t("helloWorld", { ns: getFixedNamespace("namespaceAlpha") })}</li>
        <li>{t("nested.item1", { ns: getFixedNamespace("namespaceBeta") })}</li>
        <li>{t("nested.item2", { ns: getFixedNamespace("namespaceBeta") })}</li>
      </ul>
    </div>
  );
};

const MultipleNamespacesWithHoc = withTranslation([
  "namespaceAlpha",
  "namespaceBeta",
])(_MultipleNamespacesWithHoc);

const TranslationExample: React.FC = () => {
  return (
    <div className="text-onsurface-default flex flex-col gap-md shadow-md rounded-md p-md">
      <SingleNamespaceWithHook />
      <SimpleTranslationWithHoc />
      <MultipleNamespacesWithHook />
      <MultipleNamespacesWithHoc />
      <FileUpload
        inputId="file-upload-test-translation"
        handleUploadFile={async () => {
          return { status: FILE_UPLOAD_STATUSES.success };
        }}
      />
    </div>
  );
};

export default TranslationExample;
