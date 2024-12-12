import { memo } from "react";

import Icon from "#src/components/Icon";

import TransitionWrapper from "./TransitionWrapper";

type LoadingIconProps = {
  uploading?: boolean;
};

/**
 * Animated Icon to give hints about the uploading process.
 * @param props.uploading Whether files are being uploaded.
 */
const LoadingIcon: React.FC<LoadingIconProps> = ({ uploading }) => {
  return (
    <TransitionWrapper
      isVisible={!!uploading}
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
