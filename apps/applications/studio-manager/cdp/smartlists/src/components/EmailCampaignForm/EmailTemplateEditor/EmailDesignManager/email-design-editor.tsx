import { useEffect, useRef, useState } from "react";
import EmailEditor, {
  type Editor,
  type EditorRef,
  type EmailEditorProps,
} from "react-email-editor";

import { useUnlayerInitialization } from "../use-unlayer-initialization";
import { initializeUnlayerBuilder } from "../utils";
import type { EmailDesignContent } from "./email-design-editor-types";

export const UNLAYER_EDITOR_MIN_HEIGHT = "80vh";
export const UNLAYER_PROJECT_ID = 4736;

export type EmailDesignEditorProps = {
  /**
   * A key that forces the Unlayer design to reload.
   * Use this when switching between different templates while the component stays mounted.
   */
  resetKey?: string | number;
  value: EmailDesignContent;
  onChange?: (next: EmailDesignContent) => void;
  minHeight?: EmailEditorProps["minHeight"];
  onReady?: (unlayer: Editor) => void;
};

export const EmailDesignEditor = ({
  resetKey,
  value,
  onChange,
  minHeight = UNLAYER_EDITOR_MIN_HEIGHT,
  onReady,
}: EmailDesignEditorProps) => {
  const { unlayerUser, currentLocale, companyName } =
    useUnlayerInitialization();
  const emailEditorRef = useRef<EditorRef>(null);
  const [unlayerRef, setUnlayerRef] = useState<Editor | null>(null);

  const exportContent = () => {
    const editor = emailEditorRef.current?.editor;
    if (!editor) return;

    editor.exportHtml(({ design, html }) => {
      const nextDesign = JSON.stringify(design);
      const nextHtml = html;
      onChange?.({ design: nextDesign, html: nextHtml });
    });
  };

  const handleReady: EmailEditorProps["onReady"] = (unlayer: Editor) => {
    setUnlayerRef(unlayer);
    initializeUnlayerBuilder({
      emailBuilderRef: unlayer,
      initialDesign: value.design || null,
    });
    unlayer.addEventListener("design:updated", exportContent);
    onReady?.(unlayer);
  };

  useEffect(() => {
    if (!unlayerRef) return;
    initializeUnlayerBuilder({
      emailBuilderRef: unlayerRef,
      initialDesign: value.design || null,
    });
  }, [resetKey, value.design]);

  useEffect(() => {
    return () => {
      try {
        unlayerRef?.removeEventListener("design:updated");
      } catch (error) {
        console.error("Failed to remove design:updated listener:", error);
      }
    };
  }, [unlayerRef]);

  return (
    <EmailEditor
      ref={emailEditorRef}
      minHeight={minHeight}
      onReady={handleReady}
      options={{
        features: {
          preview: true,
        },
        designTags: {
          business_name: companyName,
        },
        locale: currentLocale,
        projectId: UNLAYER_PROJECT_ID,
        user: unlayerUser,
      }}
    />
  );
};
