import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import Button from "#src/components/Button";

import FileUpload from "./FileUpload";
import { FILE_TYPES, type FileType, type FileUploadTracker } from "./constants";
import { simulateUploadToBackend } from "./storiesHelpers";

/**
 * A React component for file uploads, with built-in upload tracking.<br>
 * Tracks upload progress using React state, which can be managed externally by the parent component
 * or internally by the component itself.<br>
 * Apart from the `handleUploadFile` function, all upload logic is encapsulated within the component.<br>
 * <a href="https://www.figma.com/design/aQ73ihLayonUHVquF0QY2C/Proto-designSystem?node-id=809-14283" target="_blank">Figma</a><br>
 */
const meta: Meta<typeof FileUpload> = {
  component: FileUpload,
  argTypes: {
    autoUpload: {
      control: { type: "boolean" },
      table: { defaultValue: { summary: "false" } },
    },
    disabled: {
      control: { type: "boolean" },
      table: { defaultValue: { summary: "false" } },
    },
    fileExtensionList: {
      control: { type: "object", include: FILE_TYPES },
    },
    inline: {
      control: { type: "boolean" },
      table: { defaultValue: { summary: "false" } },
    },
    multiple: {
      control: { type: "boolean" },
      table: { defaultValue: { summary: "false" } },
    },
  },
};

export default meta;

type Story = StoryObj<typeof FileUpload>;

export const FileUploadStory: Story = {
  name: "FileUpload",
  args: {
    autoUpload: true,
    className: "w-fit",
    customTexts: {
      dragAndDropFileCTA: "Or drag and drop the core of your desire here",
      uploadFileCTA: "Upload something you desire",
      fileExtensionList: "JPG, PNG, all kinds of images",
    },
    disabled: false,
    fileExtensionList: ["png", "jpg", "image/*"] as FileType[],
    fileUploadTrackerList: undefined,
    handleUploadFile: simulateUploadToBackend,
    inline: false,
    id: "file-upload-main",
    inputName: "file-uploader",
    multiple: true,
    onFileDrop: undefined,
    onInputChange: undefined,
    setFileUploadTrackerList: undefined,
    uploadCallback: undefined,
  },
};

export const FileUploadHandy: Story = {
  name: "FileUpload Handy",
  render: (args) => {
    return <FileUpload autoUpload className="w-fit" multiple {...args} />;
  },
  args: {
    handleUploadFile: simulateUploadToBackend,
    id: "file-upload-handy",
    customTexts: {
      fileExtensionList: "All documents accepted !",
    },
  },
};

export const FileUploadFullyControlled: Story = {
  name: "FileUpload Fully Controlled",
  render: (args) => {
    const [triggerUpload, setTriggerUpload] = useState(false);
    const [fileUploadTrackerList, setFileUploadTrackerList] = useState<
      FileUploadTracker[]
    >([]);
    return (
      <div>
        <FileUpload
          autoUpload={triggerUpload}
          className="w-fit"
          customTexts={{ fileExtensionList: "All images !" }}
          fileExtensionList={["image/*"]}
          fileUploadTrackerList={fileUploadTrackerList}
          onFileDrop={({ fileList, newItems }) => {
            console.log(
              "The user drops the following items : ",
              fileList?.item,
            );
            console.log(
              "After filter, get these items : ",
              newItems.map((item) => item.file.name).join(","),
            );
          }}
          onInputChange={({ fileList, newItems }) => {
            console.log("The user adds the following items : ", fileList?.item);
            console.log(
              "After filter, get these items : ",
              newItems.map((item) => item.file.name).join(","),
            );
          }}
          setFileUploadTrackerList={setFileUploadTrackerList}
          uploadCallback={() => setTriggerUpload(false)}
          {...args}
        />
        {fileUploadTrackerList.length > 0 && (
          <p>Do some stuff with known files</p>
        )}
        <ul>
          {fileUploadTrackerList
            .filter((item) => item.status === "default")
            .map((item) => (
              <li key={item.file.name}>{item.file.name}</li>
            ))}
        </ul>
        <Button
          size="md"
          intent="call-to-action"
          color="main"
          className="mt-lg"
          iconLeft="upload-01"
          onClick={() => {
            setTriggerUpload(true);
          }}
          disabled={fileUploadTrackerList.length === 0}
          label="Finalize"
        />
      </div>
    );
  },
  args: {
    handleUploadFile: simulateUploadToBackend,
    id: "file-upload-controlled",
  },
};
