import { memo } from "react";

import Icon from "#src/components/Icon";

import TransitionWrapper from "./TransitionWrapper";

type LoadingIconProps = {
  isUploading?: boolean;
};

/**
 * Animated Icon to give hints about the uploading process.
 * @param props.uploading Whether files are being uploaded.
 */
const LoadingIcon = ({ isUploading = false }: LoadingIconProps) => {
  return (
    <TransitionWrapper
      isVisible={!!isUploading}
      classNameVisibility="max-h-icon-lg"
    >
      <Icon
        icon="upload-cloud-02"
        size="lg"
        className="text-onsurface-link-rest"
      />
    </TransitionWrapper>
  );
};

export default memo(LoadingIcon);
