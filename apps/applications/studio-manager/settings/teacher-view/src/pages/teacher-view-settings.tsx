import type { FC } from "react";

import { DetailsLayout, Loader } from "@bsport/kaizen-primitive-core";

import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { TeacherViewSettings } from "#src/components/teacher-view-settings/teacher-view-settings";
import { useTranslation } from "#src/utils/i18n";

const TeacherViewSettingsPage: FC = () => {
  const { t } = useTranslation("common");

  return (
    <DetailsLayout>
      <DetailsLayout.Header pageTitle={t("teacherViewSettings.title")} />
      <DetailsLayout.Content>
        <QueryBoundary
          loadingFallback={<Loader className="w-full h-full" size="xl" />}
        >
          <TeacherViewSettings />
        </QueryBoundary>
      </DetailsLayout.Content>
    </DetailsLayout>
  );
};

export default TeacherViewSettingsPage;
